import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transactions';

async function createFixedUser() {
  try {
    await mongoose.connect(MONGO_URI);
    const email = 'fixeduser@example.com';
    const password = 'FixedPassword123';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log('Fixed user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating fixed user:', error);
    process.exit(1);
  }
}

createFixedUser();
