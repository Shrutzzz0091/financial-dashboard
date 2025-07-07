import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction';

dotenv.config();

const mongoURI = process.env.MONGO_URI || '';

export const importTransactions = async (filePath: string) => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    const data = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const transactions = JSON.parse(data);

    await Transaction.insertMany(transactions);
    console.log('Transactions imported successfully');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error importing transactions:', error);
  }
};

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide the path to the transactions JSON file as an argument');
    process.exit(1);
  }

  importTransactions(filePath).then(() => process.exit(0));
}
