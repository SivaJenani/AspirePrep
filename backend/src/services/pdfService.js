"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPdfContent = extractPdfContent;

const child_process = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Executes the Python multi-engine PDF extractor.
 * Engines supported:
 * - 'pymupdf' (fitz): Ultra-fast, accurate text + layout extraction + block bboxes
 * - 'pdfplumber': Structured content, tables, multi-column analysis
 * - 'pypdf': Lightweight, pure Python extraction
 * - 'pdfminer': Deep layout analysis, precise character coordinates & font metrics
 * - 'auto': Hybrid cascaded intelligence (PyMuPDF + pdfplumber for tables)
 */
async function extractPdfContent(fileDataOrPath, engine = 'auto') {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '../../scripts/extract_pdf.py');
        let tempFilePath = null;
        let commandArg = '';

        try {
            if (typeof fileDataOrPath === 'string' && fs.existsSync(fileDataOrPath)) {
                commandArg = fileDataOrPath;
            } else if (Buffer.isBuffer(fileDataOrPath)) {
                // Write buffer to temporary file for fastest parsing
                const tempDir = path.resolve(__dirname, '../../../tmp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                tempFilePath = path.join(tempDir, `pdf_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
                fs.writeFileSync(tempFilePath, fileDataOrPath);
                commandArg = tempFilePath;
            } else if (typeof fileDataOrPath === 'string') {
                // If it's a base64 string
                const tempDir = path.resolve(__dirname, '../../../tmp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                const cleanBase64 = fileDataOrPath.includes(',') ? fileDataOrPath.split(',')[1] : fileDataOrPath;
                const buffer = Buffer.from(cleanBase64, 'base64');
                tempFilePath = path.join(tempDir, `pdf_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
                fs.writeFileSync(tempFilePath, buffer);
                commandArg = tempFilePath;
            } else {
                return reject(new Error('Invalid PDF data provided: expected Buffer, File Path, or Base64 string'));
            }

            const pythonProcess = child_process.spawn('python3', [scriptPath, commandArg, engine], {
                stdio: ['ignore', 'pipe', 'pipe'],
                maxBuffer: 50 * 1024 * 1024 // 50MB buffer
            });

            let stdoutData = '';
            let stderrData = '';

            pythonProcess.stdout.on('data', (chunk) => {
                stdoutData += chunk.toString();
            });

            pythonProcess.stderr.on('data', (chunk) => {
                stderrData += chunk.toString();
            });

            pythonProcess.on('close', (code) => {
                // Clean up temporary file
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (e) {}
                }

                if (code !== 0) {
                    return reject(new Error(`Python PDF extractor exited with code ${code}: ${stderrData || stdoutData}`));
                }

                try {
                    const parsed = JSON.parse(stdoutData.trim());
                    resolve(parsed);
                } catch (err) {
                    reject(new Error(`Failed to parse Python extractor JSON output: ${err.message}. Raw output: ${stdoutData.slice(0, 300)}`));
                }
            });

            pythonProcess.on('error', (err) => {
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (e) {}
                }
                reject(new Error(`Failed to launch Python PDF process: ${err.message}`));
            });

        } catch (err) {
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                try { fs.unlinkSync(tempFilePath); } catch (e) {}
            }
            reject(err);
        }
    });
}
