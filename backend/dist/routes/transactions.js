"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const csv_writer_1 = require("csv-writer");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
// GET /transactions - list with filtering, sorting, pagination
router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = '10', sortBy = 'date', order = 'desc', search = '', status, type, category } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const sortOrder = order === 'asc' ? 1 : -1;
        const filter = {};
        if (search) {
            filter.$or = [
                { from: { $regex: search, $options: 'i' } },
                { to: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } },
            ];
        }
        if (status)
            filter.status = status;
        if (type)
            filter.type = type;
        if (category)
            filter.category = category;
        const total = await Transaction_1.default.countDocuments(filter);
        const transactions = await Transaction_1.default.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        res.json({ total, page: pageNum, limit: limitNum, transactions });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// POST /transactions - create a new transaction
router.post('/', async (req, res) => {
    try {
        const transaction = new Transaction_1.default(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// PUT /transactions/:id - update a transaction
router.put('/:id', async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE /transactions/:id - delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// GET /transactions/export - export CSV based on selected columns
router.get('/export', async (req, res) => {
    try {
        const { columns = '' } = req.query;
        const selectedColumns = columns.split(',').map(col => col.trim());
        const transactions = await Transaction_1.default.find({});
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: selectedColumns.map(col => ({ id: col, title: col })),
        });
        const records = transactions.map(tx => {
            const record = {};
            selectedColumns.forEach(col => {
                record[col] = tx[col] || '';
            });
            return record;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.send(csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
