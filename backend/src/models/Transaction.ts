import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'receive';
  status: 'Completed' | 'Pending';
  date: Date;
  category?: string;
  description?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['transfer', 'receive'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: { type: String },
    description: { type: String },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
