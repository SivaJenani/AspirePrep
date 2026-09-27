"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connect_1 = require("./db/connect");
const store_1 = require("./db/store");
const api_1 = require("./routes/api");
dotenv_1.default.config();

async function startServer() {
    (0, store_1.initDatabase)();
    try {
        await (0, connect_1.connectDB)();
    }
    catch (err) {
        console.warn('MongoDB is unavailable. Using the local fallback store instead.');
    }
    const app = (0, express_1.default)();
    const PORT = 3000;
    const HOST = '0.0.0.0';

    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));

    // Health check
    app.get('/api/health', (_req, res) => {
        res.json({
            status: 'ok',
            service: 'AspirePrep Backend API',
            timestamp: new Date().toISOString(),
        });
    });

    // Mount API router
    app.use('/api', api_1.apiRouter);

    const frontendDistPath = path_1.default.resolve(__dirname, '../../frontend/dist');
    const frontendIndexPath = path_1.default.join(frontendDistPath, 'index.html');
    const frontendRoot = path_1.default.resolve(__dirname, '../../frontend');

    // Serve built frontend assets if they exist, otherwise use Vite middleware in development
    if (fs_1.default.existsSync(frontendIndexPath)) {
        app.use(express_1.default.static(frontendDistPath));
        app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api')) {
                return next();
            }
            res.sendFile(frontendIndexPath);
        });
    } else {
        try {
            const { createServer: createViteServer } = await import('vite');
            const vite = await createViteServer({
                server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
                appType: 'spa',
                root: frontendRoot,
            });
            app.use(vite.middlewares);
        } catch (e) {
            console.warn('Vite dev middleware error, attempting fallback build and static serve:', e.message);
            try {
                const { execSync } = require('child_process');
                execSync('npm run build --prefix frontend', { stdio: 'inherit' });
            } catch (err) {
                console.error('Failed to build frontend:', err.message);
            }
            if (fs_1.default.existsSync(frontendDistPath)) {
                app.use(express_1.default.static(frontendDistPath));
                app.get('*', (req, res, next) => {
                    if (req.path.startsWith('/api')) {
                        return next();
                    }
                    res.sendFile(frontendIndexPath);
                });
            }
        }
    }

    app.listen(PORT, HOST, () => {
        console.log(`AspirePrep server running on http://${HOST}:${PORT}`);
    });
}

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
