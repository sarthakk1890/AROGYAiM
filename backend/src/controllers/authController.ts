import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerPatient = asyncWrapper(async (req: Request, res: Response) => {
  const user = await authService.registerPatient(req.body);
  res.status(201).json(formatResponse(true, 'Patient registered. Please verify your email.', user));
});

export const registerPhysio = asyncWrapper(async (req: Request, res: Response) => {
  const user = await authService.registerPhysio(req.body);
  res.status(201).json(formatResponse(true, 'Physiotherapist registered. Please verify your email.', user));
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  // Set secure HTTP-only cookie for refresh token
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(formatResponse(true, 'Login successful', { user, accessToken }));
});

export const logout = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await authService.logout(req.user.id);
  }
  res.clearCookie('refreshToken');
  res.json(formatResponse(true, 'Logged out successfully'));
});

export const refreshToken = asyncWrapper(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json(formatResponse(false, 'No refresh token provided'));
  }

  const { accessToken } = await authService.refreshToken(token);
  res.json(formatResponse(true, 'Token refreshed', { accessToken }));
});

export const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  await authService.verifyEmail(token);
  res.json(formatResponse(true, 'Email verified successfully'));
});

export const forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.json(formatResponse(true, 'If the email exists, a password reset link has been sent'));
});

export const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.json(formatResponse(true, 'Password reset successful'));
});

export const changePassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.id, oldPassword, newPassword);
  res.json(formatResponse(true, 'Password changed successfully'));
});
