import { createHash, timingSafeEqual } from "node:crypto";

export const adminSessionConfig = {
  password: process.env.SESSION_SECRET!,
  name: "lara-admin",
  maxAge: 60 * 60 * 24 * 14,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export type AdminSession = { unlocked?: boolean; loggedInAt?: number };

export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}