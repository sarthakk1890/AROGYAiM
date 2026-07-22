import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/userRepository';
import { emailService } from './emailService';
import { AppError } from '../middleware/errorMiddleware';
import crypto from 'crypto';
import { pool, withTransaction } from '../db';

class AuthService {
  async registerPatient(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const verificationTokenStr = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const user = await withTransaction(async (tx) => {
      const userRes = await tx.query(`
        INSERT INTO "User" (email, "passwordHash", role, status)
        VALUES ($1, $2, 'PATIENT', 'PENDING') RETURNING *
      `, [data.email, passwordHash]);
      const newUser = userRes.rows[0];

      await tx.query(`
        INSERT INTO "PatientProfile" ("userId", "firstName", "lastName", "dateOfBirth")
        VALUES ($1, $2, $3, $4)
      `, [newUser.id, data.firstName, data.lastName, data.dateOfBirth ? new Date(data.dateOfBirth) : null]);

      await tx.query(`
        INSERT INTO "VerificationToken" (token, "userId", "expiresAt")
        VALUES ($1, $2, $3)
      `, [verificationTokenStr, newUser.id, expiresAt]);

      return newUser;
    });

    await emailService.sendVerificationEmail(user.email, verificationTokenStr);
    
    return { id: user.id, email: user.email, role: user.role };
  }

  async registerPhysio(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const verificationTokenStr = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const user = await withTransaction(async (tx) => {
      const userRes = await tx.query(`
        INSERT INTO "User" (email, "passwordHash", role, status)
        VALUES ($1, $2, 'PHYSIOTHERAPIST', 'PENDING') RETURNING *
      `, [data.email, passwordHash]);
      const newUser = userRes.rows[0];

      await tx.query(`
        INSERT INTO "PhysiotherapistProfile" ("userId", "firstName", "lastName", "experienceYears")
        VALUES ($1, $2, $3, $4)
      `, [newUser.id, data.firstName, data.lastName, data.experienceYears || 0]);

      await tx.query(`
        INSERT INTO "VerificationToken" (token, "userId", "expiresAt")
        VALUES ($1, $2, $3)
      `, [verificationTokenStr, newUser.id, expiresAt]);

      return newUser;
    });

    await emailService.sendVerificationEmail(user.email, verificationTokenStr);
    
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Account is suspended', 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions);

    const refreshTokenStr = jwt.sign({ id: user.id }, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    } as jwt.SignOptions);
    
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    await pool.query(`
      INSERT INTO "RefreshToken" (token, "userId", "expiresAt")
      VALUES ($1, $2, $3)
    `, [refreshTokenStr, user.id, refreshExpiresAt]);

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken: refreshTokenStr };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.jwtRefreshSecret) as { id: string };
      
      const tokenRes = await pool.query(`
        SELECT r.*, row_to_json(u) as user
        FROM "RefreshToken" r
        JOIN "User" u ON r."userId" = u.id
        WHERE r.token = $1 AND r."revokedAt" IS NULL AND r."expiresAt" > NOW()
      `, [token]);
      
      const storedToken = tokenRes.rows[0];

      if (!storedToken || storedToken.userId !== decoded.id) {
        throw new AppError('Invalid refresh token', 401);
      }

      if (storedToken.user.status === 'SUSPENDED' || storedToken.user.deletedAt) {
        throw new AppError('Account is suspended or deleted', 403);
      }

      const accessToken = jwt.sign({ id: storedToken.userId, role: storedToken.user.role }, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
      } as jwt.SignOptions);
      
      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string) {
    await pool.query(`
      UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL
    `, [userId]);
  }

  async verifyEmail(token: string) {
    const res = await pool.query(`
      SELECT v.*, row_to_json(u) as user
      FROM "VerificationToken" v
      JOIN "User" u ON v."userId" = u.id
      WHERE v.token = $1 AND v."expiresAt" > NOW()
    `, [token]);

    const verificationRecord = res.rows[0];

    if (!verificationRecord) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await withTransaction(async (tx) => {
      await tx.query(`
        UPDATE "User" SET "emailVerified" = true, status = $1 WHERE id = $2
      `, [verificationRecord.user.role === 'PATIENT' ? 'ACTIVE' : 'PENDING', verificationRecord.userId]);

      await tx.query(`DELETE FROM "VerificationToken" WHERE id = $1`, [verificationRecord.id]);
    });

    return true;
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await pool.query(`
      INSERT INTO "PasswordResetToken" (token, "userId", "expiresAt")
      VALUES ($1, $2, $3)
    `, [resetToken, user.id, expiresAt]);

    await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    const res = await pool.query(`
      SELECT * FROM "PasswordResetToken" WHERE token = $1 AND "expiresAt" > NOW()
    `, [token]);

    const resetRecord = res.rows[0];

    if (!resetRecord) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await withTransaction(async (tx) => {
      await tx.query(`UPDATE "User" SET "passwordHash" = $1 WHERE id = $2`, [passwordHash, resetRecord.userId]);
      await tx.query(`DELETE FROM "PasswordResetToken" WHERE id = $1`, [resetRecord.id]);
      await tx.query(`UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [resetRecord.userId]);
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) throw new AppError('Invalid old password', 400);

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user.id, { passwordHash });
    await pool.query(`UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [user.id]);
  }
}

export const authService = new AuthService();
