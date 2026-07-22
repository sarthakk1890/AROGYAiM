"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const userRepository_1 = require("../repositories/userRepository");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const pagination_1 = require("../utils/pagination");
const db_1 = require("../db");
class UserService {
    async listUsers(skip, take) {
        const users = await userRepository_1.userRepository.findAll(skip, take);
        const total = await userRepository_1.userRepository.count();
        const pagination = (0, pagination_1.getPaginationData)(total, skip / take + 1, take);
        const sanitizedUsers = users.map(user => {
            const { passwordHash, ...safeUser } = user;
            return safeUser;
        });
        return { users: sanitizedUsers, pagination };
    }
    async suspendUser(userId) {
        const user = await userRepository_1.userRepository.findById(userId);
        if (!user)
            throw new errorMiddleware_1.AppError('User not found', 404);
        if (user.role === 'ADMIN')
            throw new errorMiddleware_1.AppError('Cannot suspend an admin', 403);
        const updatedUser = await userRepository_1.userRepository.update(userId, { status: 'SUSPENDED' });
        // Revoke refresh tokens
        await db_1.pool.query(`UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [userId]);
        return updatedUser;
    }
    async activateUser(userId) {
        const user = await userRepository_1.userRepository.findById(userId);
        if (!user)
            throw new errorMiddleware_1.AppError('User not found', 404);
        return userRepository_1.userRepository.update(userId, { status: 'ACTIVE' });
    }
}
exports.userService = new UserService();
