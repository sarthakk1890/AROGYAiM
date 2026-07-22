import mongoose, { Schema, Document } from 'mongoose';

export interface IRehabExercise {
  exerciseId: mongoose.Types.ObjectId;
  sets: number;
  reps: number;
  frequency: string;
  notes?: string;
}

export interface IRehabPlan extends Document {
  patientId: mongoose.Types.ObjectId;
  physioId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  exercises: IRehabExercise[];
  status: 'Active' | 'Completed' | 'Draft';
  startDate: Date;
  endDate?: Date;
}

const RehabExerciseSchema: Schema = new Schema({
  exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  frequency: { type: String, required: true }, // e.g., 'Daily', '3x/week'
  notes: { type: String }
}, { _id: false });

const RehabPlanSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  physioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  exercises: [RehabExerciseSchema],
  status: { type: String, enum: ['Active', 'Completed', 'Draft'], default: 'Draft' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IRehabPlan>('RehabPlan', RehabPlanSchema);
