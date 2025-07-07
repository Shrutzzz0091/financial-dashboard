import express, { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken } from '../middleware/authMiddleware';
import { createObjectCsvStringifier } from 'csv-writer';

const router = express.Router();

router.use(authenticateToken);

// GET /transactions - list with filtering, sorting, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'date', order = 'desc', search = '', status, type, category } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const sortOrder = order === 'asc' ? 1 : -1;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { from: { $regex: search, $options: 'i' } },
        { to: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ [sortBy as string]: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({ total, page: pageNum, limit: limitNum, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /transactions - create a new transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /transactions/:id - update a transaction
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /transactions/:id - delete a transaction
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /transactions/export - export CSV based on selected columns
router.get('/export', async (req: Request, res: Response) => {
  try {
    const { columns = '' } = req.query;
    const selectedColumns = (columns as string).split(',').map(col => col.trim());

    const transactions = await Transaction.find({});

    const csvStringifier = createObjectCsvStringifier({
      header: selectedColumns.map(col => ({ id: col, title: col })),
    });

    const records = transactions.map(tx => {
      const record: any = {};
      selectedColumns.forEach(col => {
        record[col] = (tx as any)[col] || '';
      });
      return record;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
