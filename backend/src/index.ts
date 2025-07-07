import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import User from './models/User';
import Transaction from './models/Transaction';
import { importTransactions } from './scripts/importTransactions';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB(process.env.MONGO_URI || '');

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ Create a default user if not exists
const createDefaultUser = async () => {
  const email = 'fixeduser@example.com';
  const password = 'FixedPass123';
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log('✅ Default user created:', email);
  } else {
    console.log('ℹ️ Default user already exists:', email);
  }
};

// ✅ Import transactions from file if DB is empty
const checkAndImportTransactions = async () => {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    console.log('📦 No transactions found. Importing from JSON...');
    const filePath = path.resolve(__dirname, '..', 'data', 'transactions.json'); // ✅ Correct path
    await importTransactions(filePath);
  } else {
    console.log('📊 Transactions already exist in the database');
  }
};

// ✅ Initialize
createDefaultUser().catch(console.error);
checkAndImportTransactions().catch(console.error);

// ✅ Default route
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Financial Analytics Backend is running');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
