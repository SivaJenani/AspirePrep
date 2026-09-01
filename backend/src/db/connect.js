"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspire_prep';
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('âœ… MongoDB connected successfully.');
    }
    catch (err) {
        console.error('âŒ MongoDB connection error:', err);
        throw err;
    }
}
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('âš ï¸  MongoDB disconnected. Attempting to reconnect...');
});
exports.default = mongoose_1.default;


