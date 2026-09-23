import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { parseEnum, toApiUser } from "../lib/formatters.js";
import { requireAuth } from "../middleware/auth.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";
import { storePendingRegistration, consumePendingRegistration, getPendingRegistration } from "../lib/pendingRegistrations.js";

const router = Router();
const roles = ["CITIZEN", "TECHNICIAN", "ADMIN"];
const utilityTypes = ["WATER", "GAS", "ELECTRICITY"];

const signToken = (user) =>
  jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn,
  });

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, role, skill, area } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const normalizedRole = parseEnum(role, roles, "CITIZEN");
    const existing = await prisma.user.findFirst({
      where: { email: String(email).toLowerCase(), role: normalizedRole },
    });

    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists for the selected role." });
    }

    const pending = getPendingRegistration(email, normalizedRole);

    if (pending) {
      return res.status(409).json({ message: "A pending registration for this email and role already exists. Please verify or wait for expiry." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationCode = storePendingRegistration({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: normalizedRole,
      skill: parseEnum(skill, utilityTypes, "ELECTRICITY"),
      area,
    });

    try {
      await sendVerificationEmail(email, name, verificationCode);
    } catch (emailError) {
      console.error("Verification email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Registration successful. Please check your email for the verification code.",
      requiresVerification: true,
      email: email.toLowerCase(),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-email", async (req, res, next) => {
  try {
    const { code, email, role } = req.body;

    if (!code || !email) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const normalizedRole = role ? parseEnum(role, roles, null) : undefined;
    const pendingData = consumePendingRegistration(email, normalizedRole, code);

    if (!pendingData) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const user = await prisma.user.create({
      data: {
        name: pendingData.name,
        email: pendingData.email,
        passwordHash: pendingData.passwordHash,
        phone: pendingData.phone,
        role: pendingData.role,
        emailVerified: true,
        technician:
          pendingData.role === "TECHNICIAN"
            ? {
                create: {
                  skill: pendingData.skill,
                  area: pendingData.area,
                  etaMinutes: 20,
                  distanceKm: 1.5,
                },
              }
            : undefined,
      },
      include: { technician: true },
    });

    res.json({
      message: "Email verified successfully. You can now login.",
      user: toApiUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-verification", async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedRole = role ? parseEnum(role, roles, null) : undefined;
    const existing = normalizedRole
      ? await prisma.user.findFirst({ where: { email: String(email).toLowerCase(), role: normalizedRole } })
      : await prisma.user.findFirst({ where: { email: String(email).toLowerCase() } });

    if (existing && existing.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const pending = getPendingRegistration(email, normalizedRole);

    if (!pending) {
      return res.status(404).json({ message: "No pending registration found. Please register again." });
    }

    const verificationCode = storePendingRegistration(pending.data);

    try {
      await sendVerificationEmail(pending.data.email, pending.data.name, verificationCode);
    } catch (emailError) {
      console.error("Resend verification email failed:", emailError.message);
    }

    res.json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedRole = role ? parseEnum(role, roles, null) : undefined;
    const where = { email: String(email).toLowerCase() };
    const user = normalizedRole
      ? await prisma.user.findFirst({ where: { ...where, role: normalizedRole } })
      : await prisma.user.findFirst({ where });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: "1h" });

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires: new Date(Date.now() + 60 * 60 * 1000) },
    });

    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error("Password reset email failed:", emailError.message);
    }

    res.json({ message: "Password reset email sent. Please check your inbox." });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() },
      },
    });

    if (!user || user.id !== payload.id) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const normalizedRole = role ? parseEnum(role, roles, null) : undefined;
    const where = { email: String(email ?? "").toLowerCase() };
    const user = await prisma.user.findFirst({
      where: normalizedRole ? { ...where, role: normalizedRole } : where,
      include: { technician: true },
    });

    if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: user.email,
      });
    }

    res.json({ user: toApiUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: toApiUser(req.user) });
});

router.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const phone = String(req.body.phone ?? "").trim();

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await prisma.user.findFirst({
      where: {
        email,
        role: req.user.role,
        NOT: { id: req.user.id },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists for your role." });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        phone: phone || null,
      },
      include: { technician: true },
    });

    res.json({ user: toApiUser(user) });
  } catch (error) {
    next(error);
  }
});

router.patch("/password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
});

router.patch("/location", requireAuth, async (req, res, next) => {
  try {
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: "Valid latitude and longitude are required" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        latitude,
        longitude,
        locationUpdatedAt: new Date(),
        technician:
          req.user.role === "TECHNICIAN" && req.user.technician
            ? {
                update: {
                  latitude,
                  longitude,
                  locationUpdatedAt: new Date(),
                },
              }
            : undefined,
      },
      include: { technician: true },
    });

    res.json({ user: toApiUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
