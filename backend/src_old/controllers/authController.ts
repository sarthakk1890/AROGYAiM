import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
};

export const registerPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, condition, surgeryDate } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      passwordHash,
      role: 'patient',
      condition,
      surgeryDate
    });

    await user.save();
    const token = generateToken(user._id as string, user.role);
    
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const registerPhysio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, specialization } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      passwordHash,
      role: 'physiotherapist',
      specialization,
      verificationStatus: 'Pending'
    });

    await user.save();
    const token = generateToken(user._id as string, user.role);
    
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id as string, user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};
