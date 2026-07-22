import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'patient' | 'physiotherapist' | 'admin';
  joinedAt: Date;
  // Patient fields
  condition?: string;
  surgeryDate?: Date;
  status?: 'Active' | 'Inactive'; // For patients
  // Physio fields
  specialization?: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Suspended';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'physiotherapist', 'admin'], required: true },
  joinedAt: { type: Date, default: Date.now },
  
  // Patient specific
  condition: { type: String },
  surgeryDate: { type: Date },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  
  // Physio specific
  specialization: { type: String },
  verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Suspended'], default: 'Pending' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
