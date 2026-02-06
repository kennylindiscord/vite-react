import jwt from "jsonwebtoken";
import { Role } from "../models";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export type JwtPayload = {
  sub: string;
  role: Role;
};

export function signToken(userId: string, role: Role) {
  const payload: JwtPayload = { sub: userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

