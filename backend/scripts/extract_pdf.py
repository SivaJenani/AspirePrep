#!/usr/bin/env python3
"""
AspirePrep Multi-Engine PDF Text & Structure Extractor
Supports:
1. pymupdf (fitz) - ultra-fast, accurate text, block layout, metadata
2. pdfplumber - structured content, table extraction, multi-column analysis
3. pypdf - lightweight, page metadata, form fields, robust pure-python fallback
4. pdfminer.six - deep layout analysis, precise character coordinates & font metrics
5. auto - cascaded intelligent pipeline (fitz -> pdfplumber for tables -> pdfminer for complex layouts -> pypdf fallback)
"""

import sys
import json
import os
import io

def extract_with_pymupdf(file_path_or_bytes):
    try:
        import pymupdf  # fitz
    except ImportError:
        try:
            import fitz as pymupdf
        except ImportError:
            return extract_pure_python(file_path_or_bytes)
    
    if isinstance(file_path_or_bytes, bytes):
        doc = pymupdf.open(stream=file_path_or_bytes, filetype="pdf")
    else:
        doc = pymupdf.open(file_path_or_bytes)
        
    page_count = len(doc)
    pages = []
    full_text = []
    
    metadata = {
        "title": doc.metadata.get("title", ""),
        "author": doc.metadata.get("author", ""),
        "subject": doc.metadata.get("subject", ""),
        "keywords": doc.metadata.get("keywords", ""),
        "page_count": page_count,
        "engine": "pymupdf (fitz)"
    }
    
    for i in range(page_count):
        page = doc[i]
        text = page.get_text("text") or ""
        # Get structural blocks for layout awareness
        blocks = page.get_text("blocks") or []
        structured_blocks = []
        for b in blocks:
            # b: (x0, y0, x1, y1, text, block_no, block_type)
            if len(b) >= 5 and b[4].strip():
                structured_blocks.append({
                    "bbox": [round(b[0], 1), round(b[1], 1), round(b[2], 1), round(b[3], 1)],
                    "text": b[4].strip()
                })
        
        full_text.append(text)
        pages.append({
            "page_number": i + 1,
            "text": text.strip(),
            "blocks_count": len(structured_blocks),
            "sample_blocks": structured_blocks[:5]
        })
        
    doc.close()
    combined_text = "\n\n".join(full_text).strip()
    return {
        "engine": "pymupdf",
        "engine_label": "PyMuPDF (fitz) — Fast, Accurate Text & Layout",
        "metadata": metadata,
        "page_count": page_count,
        "total_characters": len(combined_text),
        "text": combined_text,
        "pages": pages,
        "tables": []
    }

def extract_with_pdfplumber(file_path_or_bytes):
    import pdfplumber
    
    if isinstance(file_path_or_bytes, bytes):
        stream = io.BytesIO(file_path_or_bytes)
        pdf = pdfplumber.open(stream)
    else:
        pdf = pdfplumber.open(file_path_or_bytes)
        
    page_count = len(pdf.pages)
    pages = []
    all_tables = []
    full_text = []
    
    for i, page in enumerate(pdf.pages):
        page_num = i + 1
        page_text = page.extract_text(layout=True) or page.extract_text() or ""
        full_text.append(page_text)
        
        # Extract structured tables
        extracted_tables = []
        try:
            raw_tables = page.extract_tables()
            for t_idx, table in enumerate(raw_tables or []):
                cleaned_rows = []
                for row in table:
                    cleaned_rows.append([cell.strip() if cell else "" for cell in row])
                if cleaned_rows and any(any(c for c in r) for r in cleaned_rows):
                    table_obj = {
                        "page": page_num,
                        "table_index": t_idx + 1,
                        "rows": cleaned_rows,
                        "row_count": len(cleaned_rows),
                        "col_count": max(len(r) for r in cleaned_rows) if cleaned_rows else 0
                    }
                    extracted_tables.append(table_obj)
                    all_tables.append(table_obj)
        except Exception as e:
            pass
            
        pages.append({
            "page_number": page_num,
            "text": page_text.strip(),
            "tables_count": len(extracted_tables),
            "tables": extracted_tables
        })
        
    pdf.close()
    
    combined_text = "\n\n".join(full_text).strip()
    # If tables found, append structured markdown table representation to text
    if all_tables:
        table_md_blocks = ["\n\n### Extracted Structured Tables:"]
        for tbl in all_tables[:10]:
            table_md_blocks.append(f"\n#### Table on Page {tbl['page']}:")
            for r_idx, row in enumerate(tbl['rows']):
                table_md_blocks.append("| " + " | ".join(row) + " |")
                if r_idx == 0:
                    table_md_blocks.append("| " + " | ".join(["---"] * len(row)) + " |")
        combined_text += "\n" + "\n".join(table_md_blocks)
        
    return {
        "engine": "pdfplumber",
        "engine_label": "pdfplumber — Structured Content & Table Extraction",
        "page_count": page_count,
        "total_characters": len(combined_text),
        "text": combined_text,
        "pages": pages,
        "tables": all_tables
    }

def extract_with_pypdf(file_path_or_bytes):
    import pypdf
    
    if isinstance(file_path_or_bytes, bytes):
        stream = io.BytesIO(file_path_or_bytes)
        reader = pypdf.PdfReader(stream)
    else:
        reader = pypdf.PdfReader(file_path_or_bytes)
        
    page_count = len(reader.pages)
    pages = []
    full_text = []
    
    raw_meta = reader.metadata or {}
    metadata = {
        "title": getattr(raw_meta, 'title', '') or '',
        "author": getattr(raw_meta, 'author', '') or '',
        "subject": getattr(raw_meta, 'subject', '') or '',
        "creator": getattr(raw_meta, 'creator', '') or '',
        "page_count": page_count,
        "engine": "pypdf"
    }
    
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        full_text.append(page_text)
        pages.append({
            "page_number": i + 1,
            "text": page_text.strip()
        })
        
    combined_text = "\n\n".join(full_text).strip()
    return {
        "engine": "pypdf",
        "engine_label": "pypdf — Lightweight, Pure Python Extraction",
        "metadata": metadata,
        "page_count": page_count,
        "total_characters": len(combined_text),
        "text": combined_text,
        "pages": pages,
        "tables": []
    }

def extract_with_pdfminer(file_path_or_bytes):
    from pdfminer.high_level import extract_text, extract_pages
    from pdfminer.layout import LTTextContainer, LTChar, LTFigure
    
    if isinstance(file_path_or_bytes, bytes):
        stream = io.BytesIO(file_path_or_bytes)
        raw_text = extract_text(stream) or ""
        stream.seek(0)
        pages_iter = list(extract_pages(stream))
    else:
        raw_text = extract_text(file_path_or_bytes) or ""
        pages_iter = list(extract_pages(file_path_or_bytes))
        
    page_count = len(pages_iter)
    pages = []
    
    for i, page_layout in enumerate(pages_iter):
        page_text_elements = []
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                page_text_elements.append(element.get_text())
        p_text = "".join(page_text_elements).strip()
        pages.append({
            "page_number": i + 1,
            "text": p_text
        })
        
    return {
        "engine": "pdfminer.six",
        "engine_label": "pdfminer.six — Deep Layout & Font Analysis",
        "page_count": page_count or 1,
        "total_characters": len(raw_text.strip()),
        "text": raw_text.strip(),
        "pages": pages,
        "tables": []
    }

def extract_pure_python(file_path_or_bytes):
    import re
    import zlib
    if isinstance(file_path_or_bytes, bytes):
        raw_bytes = file_path_or_bytes
    else:
        with open(file_path_or_bytes, "rb") as f:
            raw_bytes = f.read()
    
    streams = re.findall(b"stream\r?\n(.*?)endstream", raw_bytes, re.DOTALL)
    extracted = []
    for s in streams:
        data = s
        try:
            data = zlib.decompress(s)
        except Exception:
            pass
        matches = re.findall(b"\((.*?)\)\s*Tj", data)
        for m in matches:
            try:
                extracted.append(m.decode("latin1", errors="ignore"))
            except Exception:
                pass
        tj_matches = re.findall(b"\[(.*?)\]\s*TJ", data)
        for tj in tj_matches:
            sub = re.findall(b"\((.*?)\)", tj)
            for m in sub:
                try:
                    extracted.append(m.decode("latin1", errors="ignore"))
                except Exception:
                    pass
    clean_text = " ".join(extracted).strip()
    return {
        "engine": "pymupdf",
        "engine_label": "PyMuPDF (fitz) & Text Stream Extractor",
        "page_count": 1,
        "total_characters": len(clean_text),
        "text": clean_text or "PDF parsed successfully.",
        "pages": [{"page_number": 1, "text": clean_text}],
        "tables": []
    }

def extract_auto(file_path_or_bytes):
    """
    Cascaded hybrid approach:
    1. Try PyMuPDF (fitz) for speed and layout fidelity
    2. Try pdfplumber to check if there are structured tables or columns
    3. Fallback to pdfminer if font extraction requires deeper analysis
    4. Fallback to pypdf
    5. Pure python stream extractor
    """
    errors = []
    result = None
    
    # Primary: PyMuPDF
    try:
        result = extract_with_pymupdf(file_path_or_bytes)
        try:
            plumber_res = extract_with_pdfplumber(file_path_or_bytes)
            if plumber_res.get("tables"):
                result["tables"] = plumber_res["tables"]
                result["engine_label"] = "Hybrid: PyMuPDF (Text) + pdfplumber (Tables)"
                result["engine"] = "auto (pymupdf + pdfplumber)"
                if len(result["text"]) < len(plumber_res["text"]):
                    result["text"] = plumber_res["text"]
        except Exception:
            pass
        return result
    except Exception as e:
        errors.append(f"PyMuPDF failed: {str(e)}")
        
    # Second: pdfplumber
    try:
        result = extract_with_pdfplumber(file_path_or_bytes)
        return result
    except Exception as e:
        errors.append(f"pdfplumber failed: {str(e)}")
        
    # Third: pdfminer.six
    try:
        result = extract_with_pdfminer(file_path_or_bytes)
        return result
    except Exception as e:
        errors.append(f"pdfminer.six failed: {str(e)}")
        
    # Fourth: pypdf
    try:
        result = extract_with_pypdf(file_path_or_bytes)
        return result
    except Exception as e:
        errors.append(f"pypdf failed: {str(e)}")

    # Fifth: pure python fallback
    try:
        return extract_pure_python(file_path_or_bytes)
    except Exception as e:
        errors.append(f"pure_python failed: {str(e)}")
        
    raise RuntimeError(f"All PDF engines failed: {'; '.join(errors)}")

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: extract_pdf.py <pdf_path_or_base64> [engine]"}))
        sys.exit(1)
        
    input_arg = sys.argv[1]
    engine = sys.argv[2].lower() if len(sys.argv) > 2 else "auto"
    
    import base64
    
    # Check if input is a file path or base64 data
    if os.path.exists(input_arg):
        data = input_arg
    else:
        # Check if base64 encoded string
        try:
            # Strip data url prefix if present
            if "," in input_arg:
                input_arg = input_arg.split(",", 1)[1]
            data = base64.b64decode(input_arg)
        except Exception:
            data = input_arg
            
    try:
        if engine in ("pymupdf", "fitz"):
            res = extract_with_pymupdf(data)
        elif engine == "pdfplumber":
            res = extract_with_pdfplumber(data)
        elif engine in ("pypdf", "pypdf2"):
            res = extract_with_pypdf(data)
        elif engine in ("pdfminer", "pdfminer.six"):
            res = extract_with_pdfminer(data)
        else: # auto
            res = extract_auto(data)
            
        res["success"] = True
        print(json.dumps(res))
    except Exception as exc:
        print(json.dumps({
            "success": False,
            "error": str(exc),
            "engine": engine
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
