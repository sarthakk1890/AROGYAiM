import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${env.frontendUrl}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: env.email.from,
      to,
      subject: 'Verify your MOVA Account',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${to}`);
    } catch (error) {
      logger.error(`Error sending verification email to ${to}:`, error);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: env.email.from,
      to,
      subject: 'Reset your MOVA Password',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${to}`);
    } catch (error) {
      logger.error(`Error sending password reset email to ${to}:`, error);
    }
  }
}

export const emailService = new EmailService();
