"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.env.email.host,
            port: env_1.env.email.port,
            auth: {
                user: env_1.env.email.user,
                pass: env_1.env.email.pass,
            },
        });
    }
    async sendVerificationEmail(to, token) {
        const verificationUrl = `http://localhost:${env_1.env.port}/api/v1/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: env_1.env.email.from,
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
            logger_1.default.info(`Verification email sent to ${to}`);
        }
        catch (error) {
            logger_1.default.error(`Error sending verification email to ${to}:`, error);
        }
    }
    async sendPasswordResetEmail(to, token) {
        const resetUrl = `http://localhost:${env_1.env.port}/api/v1/auth/reset-password?token=${token}`;
        const mailOptions = {
            from: env_1.env.email.from,
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
            logger_1.default.info(`Password reset email sent to ${to}`);
        }
        catch (error) {
            logger_1.default.error(`Error sending password reset email to ${to}:`, error);
        }
    }
}
exports.emailService = new EmailService();
