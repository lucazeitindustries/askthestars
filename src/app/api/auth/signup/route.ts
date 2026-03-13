import { createSession, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, birthDate, birthTime, birthPlace } = await req.json();

    if (!email || !birthDate) {
      return Response.json(
        { error: 'Email and birth date are required' },
        { status: 400 }
      );
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    const user = {
      email,
      birthDate,
      birthTime: birthTime || undefined,
      birthPlace: birthPlace || undefined,
      plan: 'free' as const,
      createdAt: new Date().toISOString(),
    };

    const token = await createSession(user);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return Response.json({
      success: true,
      user: { email: user.email, birthDate: user.birthDate },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Signup failed' }, { status: 500 });
  }
}
