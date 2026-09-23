import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, name, code) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    console.log(`[DEV EMAIL] Verification code for ${email}: ${code}`);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.resend.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "resend",
      pass: process.env.EMAIL_PASS || process.env.RESEND_API_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Verify your Smart Utility account",
    text: `Hi ${name},\n\nYour verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
    html: `<p>Hi ${name},</p><p>Your verification code is <strong>${code}</strong>.</p><p>This code will expire in 15 minutes.</p>`,
  });
}

export async function sendPasswordResetEmail(email, name, token) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    console.log(`[DEV EMAIL] Password reset link for ${email}: ${token}`);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.resend.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "resend",
      pass: process.env.EMAIL_PASS || process.env.RESEND_API_KEY,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Reset your Smart Utility password",
    text: `Hi ${name},\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
    html: `<p>Hi ${name},</p><p>Click <a href="${resetUrl}">this link</a> to reset your password.</p><p>This link will expire in 1 hour.</p>`,
  });
}
