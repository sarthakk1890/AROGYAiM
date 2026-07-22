"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const userRepository_1 = require("../repositories/userRepository");
const emailService_1 = require("./emailService");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../db");
class AuthService {
    async registerPatient(data) {
        const existingUser = await userRepository_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new errorMiddleware_1.AppError('User already exists', 400);
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const verificationTokenStr = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const user = await (0, db_1.withTransaction)(async (tx) => {
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
        await emailService_1.emailService.sendVerificationEmail(user.email, verificationTokenStr);
        return { id: user.id, email: user.email, role: user.role };
    }
    async registerPhysio(data) {
        const existingUser = await userRepository_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new errorMiddleware_1.AppError('User already exists', 400);
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const verificationTokenStr = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const user = await (0, db_1.withTransaction)(async (tx) => {
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
        await emailService_1.emailService.sendVerificationEmail(user.email, verificationTokenStr);
        return { id: user.id, email: user.email, role: user.role };
    }
    async login(email, password) {
        const user = await userRepository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new errorMiddleware_1.AppError('Invalid credentials', 401);
        }
        if (user.status === 'SUSPENDED') {
            throw new errorMiddleware_1.AppError('Account is suspended', 403);
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new errorMiddleware_1.AppError('Invalid credentials', 401);
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.env.jwtSecret, {
            expiresIn: env_1.env.jwtExpiresIn,
        });
        const refreshTokenStr = jsonwebtoken_1.default.sign({ id: user.id }, env_1.env.jwtRefreshSecret, {
            expiresIn: env_1.env.jwtRefreshExpiresIn,
        });
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);
        await db_1.pool.query(`
      INSERT INTO "RefreshToken" (token, "userId", "expiresAt")
      VALUES ($1, $2, $3)
    `, [refreshTokenStr, user.id, refreshExpiresAt]);
        return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken: refreshTokenStr };
    }
    async refreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
            const tokenRes = await db_1.pool.query(`
        SELECT r.*, row_to_json(u) as user
        FROM "RefreshToken" r
        JOIN "User" u ON r."userId" = u.id
        WHERE r.token = $1 AND r."revokedAt" IS NULL AND r."expiresAt" > NOW()
      `, [token]);
            const storedToken = tokenRes.rows[0];
            if (!storedToken || storedToken.userId !== decoded.id) {
                throw new errorMiddleware_1.AppError('Invalid refresh token', 401);
            }
            if (storedToken.user.status === 'SUSPENDED' || storedToken.user.deletedAt) {
                throw new errorMiddleware_1.AppError('Account is suspended or deleted', 403);
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: storedToken.userId, role: storedToken.user.role }, env_1.env.jwtSecret, {
                expiresIn: env_1.env.jwtExpiresIn,
            });
            return { accessToken };
        }
        catch (error) {
            throw new errorMiddleware_1.AppError('Invalid or expired refresh token', 401);
        }
    }
    async logout(userId) {
        await db_1.pool.query(`
      UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL
    `, [userId]);
    }
    async verifyEmail(token) {
        const res = await db_1.pool.query(`
      SELECT v.*, row_to_json(u) as user
      FROM "VerificationToken" v
      JOIN "User" u ON v."userId" = u.id
      WHERE v.token = $1 AND v."expiresAt" > NOW()
    `, [token]);
        const verificationRecord = res.rows[0];
        if (!verificationRecord) {
            throw new errorMiddleware_1.AppError('Invalid or expired verification token', 400);
        }
        await (0, db_1.withTransaction)(async (tx) => {
            await tx.query(`
        UPDATE "User" SET "emailVerified" = true, status = $1 WHERE id = $2
      `, [verificationRecord.user.role === 'PATIENT' ? 'ACTIVE' : 'PENDING', verificationRecord.userId]);
            await tx.query(`DELETE FROM "VerificationToken" WHERE id = $1`, [verificationRecord.id]);
        });
        return true;
    }
    async forgotPassword(email) {
        const user = await userRepository_1.userRepository.findByEmail(email);
        if (!user)
            return;
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await db_1.pool.query(`
      INSERT INTO "PasswordResetToken" (token, "userId", "expiresAt")
      VALUES ($1, $2, $3)
    `, [resetToken, user.id, expiresAt]);
        await emailService_1.emailService.sendPasswordResetEmail(user.email, resetToken);
    }
    async resetPassword(token, newPassword) {
        const res = await db_1.pool.query(`
      SELECT * FROM "PasswordResetToken" WHERE token = $1 AND "expiresAt" > NOW()
    `, [token]);
        const resetRecord = res.rows[0];
        if (!resetRecord) {
            throw new errorMiddleware_1.AppError('Invalid or expired password reset token', 400);
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await (0, db_1.withTransaction)(async (tx) => {
            await tx.query(`UPDATE "User" SET "passwordHash" = $1 WHERE id = $2`, [passwordHash, resetRecord.userId]);
            await tx.query(`DELETE FROM "PasswordResetToken" WHERE id = $1`, [resetRecord.id]);
        });
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await userRepository_1.userRepository.findById(userId);
        if (!user)
            throw new errorMiddleware_1.AppError('User not found', 404);
        const isMatch = await bcrypt_1.default.compare(oldPassword, user.passwordHash);
        if (!isMatch)
            throw new errorMiddleware_1.AppError('Invalid old password', 400);
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await userRepository_1.userRepository.update(user.id, { passwordHash });
    }
}
exports.authService = new AuthService();
