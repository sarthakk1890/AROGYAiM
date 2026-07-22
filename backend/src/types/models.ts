export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'PATIENT' | 'PHYSIOTHERAPIST' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: string | null;
  contactNumber: string | null;
  address: string | null;
  medicalHistory: string | null;
  currentCondition: string | null;
  emergencyContact: string | null;
  recoveryGoals: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PhysiotherapistProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  contactNumber: string | null;
  qualifications: string[];
  experienceYears: number;
  languages: string[];
  specializations: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  licenseNumber: string | null;
  documentsUrl: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface AdminProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  department: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBy: string | null;
  createdAt: Date;
}

export interface VerificationToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'APPOINTMENT_BOOKED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_REMINDER' | 'REHAB_ASSIGNED' | 'REHAB_UPDATED' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface Availability {
  id: string;
  physiotherapistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  physiotherapistId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface Exercise {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  instructions: string;
  targetMuscle: string;
  equipment: string;
  difficulty: string;
  videoUrl: string | null;
  imageUrl: string | null;
  contraindications: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ExercisePlan {
  id: string;
  physiotherapistId: string;
  name: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  version: number;
  parentPlanId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ExercisePlanItem {
  id: string;
  planId: string;
  exerciseId: string;
  sets: number;
  repetitions: number;
  duration: number;
  frequency: string;
  restTime: number;
  notes: string | null;
  displayOrder: number;
}

export interface AssignedExercisePlan {
  id: string;
  patientId: string;
  physiotherapistId: string;
  planId: string;
  startDate: Date;
  endDate: Date | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSession {
  id: string;
  assignedPlanId: string;
  patientId: string;
  scheduledDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionCompletion {
  id: string;
  sessionId: string;
  exerciseId: string;
  completedSets: number;
  completedReps: number;
  actualDuration: number;
  painLevel: number;
  feedback: string | null;
  completedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  emailAppointmentReminders: boolean;
  emailRehabUpdates: boolean;
  emailSystemAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}
