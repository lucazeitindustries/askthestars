import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'askthestars-mvp-secret-change-in-prod'
);

const COOKIE_NAME = 'ats_session';

export interface UserData {
  email: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  plan: 'free' | 'star' | 'cosmic';
  createdAt: string;
}

// In-memory user store (MVP — replace with DB later)
const users = new Map<string, UserData>();

export async function createSession(user: UserData): Promise<string> {
  // Store user
  users.set(user.email, user);

  // Create JWT
  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  return token;
}

export async function getSessionUser(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;
    if (!email) return null;

    return users.get(email) || null;
  } catch {
    return null;
  }
}

export function getUser(email: string): UserData | undefined {
  return users.get(email);
}

export function updateUser(email: string, updates: Partial<UserData>): UserData | null {
  const user = users.get(email);
  if (!user) return null;
  const updated = { ...user, ...updates };
  users.set(email, updated);
  return updated;
}

export { COOKIE_NAME };
