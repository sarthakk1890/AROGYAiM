import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  title: string;
  description: string;
  category: 'Mobility' | 'Strength' | 'Stretching' | 'Balance' | 'Cardio';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  imageUrl?: string;
  videoUrl?: string;
}

const ExerciseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Mobility', 'Strength', 'Stretching', 'Balance', 'Cardio'],
    required: true
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  durationMinutes: { type: Number, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
