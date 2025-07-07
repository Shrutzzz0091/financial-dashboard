"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const transactions_1 = __importDefault(require("./routes/transactions"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
(0, db_1.connectDB)(process.env.MONGO_URI || '');
// ✅ Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/transactions', transactions_1.default);
// ✅ Root endpoint
app.get('/', (req, res) => {
    res.send('🚀 Financial Analytics Backend is running');
});
// ✅ Start server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});
