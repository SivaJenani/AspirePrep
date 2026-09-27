"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();

const MONGODB_URI = process.env.MONGODB_URI;
mongoose_1.default.set('bufferCommands', false);

async function connectDB() {
    if (!MONGODB_URI) {
        console.warn('MongoDB URI not configured. Using in-memory fallback store.');
        return;
    }
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 2000
        });
        console.log('MongoDB connected successfully.');
    }
    catch (err) {
        console.warn('MongoDB not connected — using in-memory fallback store.');
    }
}
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});
exports.default = mongoose_1.default;
