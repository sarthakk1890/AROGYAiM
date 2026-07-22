import { Request, Response } from 'express';
import User from '../models/User';

export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-passwordHash');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

export const getPhysios = async (req: Request, res: Response): Promise<void> => {
  try {
    const physios = await User.find({ role: 'physiotherapist' }).select('-passwordHash');
    res.json(physios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching physiotherapists' });
  }
};

export const verifyPhysio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Verified' | 'Pending' | 'Suspended'
    
    const physio = await User.findByIdAndUpdate(
      id, 
      { verificationStatus: status }, 
      { new: true }
    ).select('-passwordHash');

    if (!physio) {
      res.status(404).json({ message: 'Physiotherapist not found' });
      return;
    }

    res.json(physio);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying physiotherapist' });
  }
};
