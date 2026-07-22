import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  physioId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
  type: 'Video' | 'In-Person';
  notes?: string;
}

const AppointmentSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  physioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],
    default: 'Requested'
  },
  type: { type: String, enum: ['Video', 'In-Person'], required: true },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
