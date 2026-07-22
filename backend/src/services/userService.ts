import { userRepository } from '../repositories/userRepository';
import { patientRepository } from '../repositories/patientRepository';
import { physioRepository } from '../repositories/physioRepository';
import { appointmentRepository } from '../repositories/appointmentRepository';
import { AppError } from '../middleware/errorMiddleware';
import { getPaginationData } from '../utils/pagination';
import { pool } from '../db';

const PATIENT_PROFILE_FIELDS = [
  'firstName', 'lastName', 'dateOfBirth', 'gender', 'contactNumber', 'address',
  'medicalHistory', 'currentCondition', 'emergencyContact', 'recoveryGoals',
];
const PHYSIO_PROFILE_FIELDS = [
  'firstName', 'lastName', 'contactNumber', 'qualifications', 'experienceYears',
  'languages', 'specializations', 'licenseNumber',
];

class UserService {
  async getMyProfile(userId: string, role: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const { passwordHash, ...safeUser } = user;

    let profile = null;
    if (role === 'PATIENT') profile = await patientRepository.findByUserId(userId);
    if (role === 'PHYSIOTHERAPIST') profile = await physioRepository.findByUserId(userId);

    return { ...safeUser, profile };
  }

  async updateMyProfile(userId: string, role: string, data: any) {
    const allowedFields = role === 'PATIENT' ? PATIENT_PROFILE_FIELDS : role === 'PHYSIOTHERAPIST' ? PHYSIO_PROFILE_FIELDS : [];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }

    if (role === 'PATIENT') {
      await patientRepository.update(userId, updateData);
    } else if (role === 'PHYSIOTHERAPIST') {
      await physioRepository.update(userId, updateData);
    } else {
      throw new AppError('This role has no editable profile', 400);
    }

    return this.getMyProfile(userId, role);
  }

  async getStats() {
    const [totalPatients, totalPhysios, pendingVerifications, totalAppointments] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role = 'PATIENT' AND "deletedAt" IS NULL`),
      pool.query(`SELECT COUNT(*) FROM "User" WHERE role = 'PHYSIOTHERAPIST' AND "deletedAt" IS NULL`),
      pool.query(`SELECT COUNT(*) FROM "PhysiotherapistProfile" WHERE "verificationStatus" = 'PENDING'`),
      pool.query(`SELECT COUNT(*) FROM "Appointment" WHERE "deletedAt" IS NULL`),
    ]);
    return {
      totalPatients: parseInt(totalPatients.rows[0].count, 10),
      totalPhysios: parseInt(totalPhysios.rows[0].count, 10),
      pendingVerifications: parseInt(pendingVerifications.rows[0].count, 10),
      totalAppointments: parseInt(totalAppointments.rows[0].count, 10),
    };
  }

  async listPendingPhysios() {
    const result = await pool.query(`
      SELECT u.id, u.email, u."createdAt", prof.*
      FROM "User" u
      JOIN "PhysiotherapistProfile" prof ON prof."userId" = u.id
      WHERE prof."verificationStatus" = 'PENDING' AND u."deletedAt" IS NULL
      ORDER BY u."createdAt" ASC
    `);
    return result.rows;
  }

  async reviewPhysio(userId: string, approve: boolean) {
    const user = await userRepository.findById(userId);
    if (!user || user.role !== 'PHYSIOTHERAPIST') throw new AppError('Physiotherapist not found', 404);

    await physioRepository.update(userId, { verificationStatus: approve ? 'VERIFIED' : 'REJECTED' } as any);
    await userRepository.update(userId, { status: approve ? 'ACTIVE' : 'SUSPENDED' });

    return this.getMyProfile(userId, 'PHYSIOTHERAPIST');
  }

  async listAllAppointments(skip: number, take: number) {
    const [appointments, total] = await Promise.all([
      appointmentRepository.findAllForAdmin(skip, take),
      appointmentRepository.countAll(),
    ]);
    return { appointments, pagination: getPaginationData(total, skip / take + 1, take) };
  }

  async listUsers(skip: number, take: number) {
    const users = await userRepository.findAll(skip, take);
    const total = await userRepository.count();
    const pagination = getPaginationData(total, skip / take + 1, take);
    
    const sanitizedUsers = users.map(user => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });

    return { users: sanitizedUsers, pagination };
  }

  async suspendUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === 'ADMIN') throw new AppError('Cannot suspend an admin', 403);

    const updatedUser = await userRepository.update(userId, { status: 'SUSPENDED' });
    
    // Revoke refresh tokens
    await pool.query(`UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [userId]);
    
    return updatedUser;
  }

  async activateUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    return userRepository.update(userId, { status: 'ACTIVE' });
  }
}

export const userService = new UserService();
