import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { hashToken, signAccessToken, verifyRefreshToken } from "../lib/jwt.js";
import { loginSchema, refreshSchema, registerSchema } from "../validators/auth.js";
import {
  clearAuthCookies,
  createSession,
  getProfile,
  loginUser,
  registerUser,
  revokeRefreshTokenByValue,
  setAuthCookies,
} from "../services/auth.service.js";

export async function registerController(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);
    const user = await registerUser(body);
    const { accessToken, refreshToken } = await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setAuthCookies(res, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
    });
  } catch (error: any) {
    const message = error?.message || "Validation failed";
    return res.status(400).json({
      message,
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);
    const user = await loginUser(body);
    const { accessToken, refreshToken } = await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setAuthCookies(res, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error?.message || "Invalid credentials",
    });
  }
}

export async function refreshController(req: Request, res: Response) {
  try {
    const body = refreshSchema.parse(req.body);
    const incomingRefreshToken = body.refreshToken || req.cookies?.refresh_token;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = verifyRefreshToken(incomingRefreshToken);
    const tokenHash = hashToken(incomingRefreshToken);
    const existingToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
      },
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() },
    });

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User no longer active" });
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await revokeRefreshTokenByValue(refreshToken);
    }

    clearAuthCookies(res);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out successfully" });
  }
}

export async function meController(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const profile = await getProfile(user.id);

  return res.status(200).json({ user: profile });
}
