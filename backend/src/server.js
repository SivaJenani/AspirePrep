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
    const PORT = process.env.PORT || 5000;
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use('/api', api_1.apiRouter);
    const frontendDistPath = path_1.default.resolve(__dirname, '../../frontend/dist');
    const frontendIndexPath = path_1.default.join(frontendDistPath, 'index.html');
    if (fs_1.default.existsSync(frontendIndexPath)) {
        app.use(express_1.default.static(frontendDistPath));
        app.get(/^(?!\/api).*/, (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }
            res.sendFile(frontendIndexPath);
        });
    }
    app.get('/api/health', (_req, res) => {
        res.json({
            status: 'ok',
            service: 'AspirePrep Backend API',
            timestamp: new Date().toISOString(),
        });
    });
    app.use((_req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
    app.listen(PORT, () => {
        console.log(`AspirePrep Backend running on http://localhost:${PORT}`);
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

