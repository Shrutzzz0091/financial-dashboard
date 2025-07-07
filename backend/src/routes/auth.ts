import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/register', async (req: Request, res: Response) => {
  res.status(201).json({ message: 'Registration is disabled in this simple auth' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // Allow any login with any email, no password check
    const token = jwt.sign({ userId: email || 'anonymous' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
