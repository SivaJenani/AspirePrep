# AspirePrep Developer Guidelines

Welcome to the **AspirePrep** exam preparation and AI 3D study platform. This file contains persistent guidelines and rules that all AI coding agents (including Antigravity) must strictly adhere to when modifying this project.

---

## 🚀 Core Architecture Conventions

### 1. Full-Stack Structure
*   **Vite React SPA + Express Backend**: The application is configured to run fully client-and-server-side. 
*   **Security of Secrets**: Keep all API keys (such as `GEMINI_API_KEY`) strictly on the server-side (`/server/*`). Never expose keys or process them on the client-side (`/src/*`). Use proxied `/api/*` routes.
*   **ESM Bundle Configuration**: When building the Express server, `esbuild` bundles the server-side TypeScript code into a single CommonJS file (`dist/server.cjs`) to ensure lightning-fast cold-starts and seamless runtime execution on Cloud Run.

### 2. Styling and Responsive Design
*   **Tailwind CSS**: Use Tailwind utility classes directly for all styling. Never create custom CSS sheets outside of global imports.
*   **Responsive Navbar Spacing**: Primary navigation options are kept concise. Links such as "University Exams", "Mistakes Notebook", and "1v1 Speed Duel" are conditionally hidden on narrow desktop viewports using `hidden xl:flex` to prevent layout overlaps. These features must remain fully accessible via the **Prep Tools** dropdown selection.

### 3. Veo 3.1 Video Suite Design Patterns
*   **Three-Step Generation Flow**: All AI video generation uses the three-step polling pattern to fetch progress from Google's `veo-3.1-fast-generate-preview` video model.
*   **Fallback & Sandbox Resilience**: Always keep the interactive fallback sandbox active so the application works seamlessly for students even if API credentials or network tokens are temporarily unconfigured.

---

## 🛠️ Code Quality Standards
*   **TypeScript**: Maintain strict type safety across all frontend pages and backend controllers.
*   **Lucide Icons**: Import all UI icons exclusively from `lucide-react`.
*   **No Obtrusive Popups**: Avoid any usage of blockable APIs such as `window.alert` or `window.open` inside preview iFrames. Use React-state modals or toasts.
