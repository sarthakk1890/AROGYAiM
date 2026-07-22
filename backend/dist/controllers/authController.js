"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.refreshToken = exports.logout = exports.login = exports.registerPhysio = exports.registerPatient = void 0;
const authService_1 = require("../services/authService");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
exports.registerPatient = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const user = await authService_1.authService.registerPatient(req.body);
    res.status(201).json((0, response_1.formatResponse)(true, 'Patient registered. Please verify your email.', user));
});
exports.registerPhysio = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const user = await authService_1.authService.registerPhysio(req.body);
    res.status(201).json((0, response_1.formatResponse)(true, 'Physiotherapist registered. Please verify your email.', user));
});
exports.login = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService_1.authService.login(email, password);
    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env_1.env.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json((0, response_1.formatResponse)(true, 'Login successful', { user, accessToken }));
});
exports.logout = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    if (req.user) {
        await authService_1.authService.logout(req.user.id);
    }
    res.clearCookie('refreshToken');
    res.json((0, response_1.formatResponse)(true, 'Logged out successfully'));
});
exports.refreshToken = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json((0, response_1.formatResponse)(false, 'No refresh token provided'));
    }
    const { accessToken } = await authService_1.authService.refreshToken(token);
    res.json((0, response_1.formatResponse)(true, 'Token refreshed', { accessToken }));
});
exports.verifyEmail = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const token = req.query.token;
    await authService_1.authService.verifyEmail(token);
    res.json((0, response_1.formatResponse)(true, 'Email verified successfully'));
});
exports.forgotPassword = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    await authService_1.authService.forgotPassword(req.body.email);
    res.json((0, response_1.formatResponse)(true, 'If the email exists, a password reset link has been sent'));
});
exports.resetPassword = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService_1.authService.resetPassword(token, newPassword);
    res.json((0, response_1.formatResponse)(true, 'Password reset successful'));
});
exports.changePassword = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await authService_1.authService.changePassword(req.user.id, oldPassword, newPassword);
    res.json((0, response_1.formatResponse)(true, 'Password changed successfully'));
});
