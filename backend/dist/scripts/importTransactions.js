"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URI || '';
const importTransactions = async (filePath) => {
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB connected');
        const data = fs_1.default.readFileSync(path_1.default.resolve(filePath), 'utf-8');
        const transactions = JSON.parse(data);
        await Transaction_1.default.insertMany(transactions);
        console.log('Transactions imported successfully');
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error importing transactions:', error);
        process.exit(1);
    }
};
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide the path to the transactions JSON file as an argument');
    process.exit(1);
}
importTransactions(filePath);
