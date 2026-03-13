import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        email: user.email,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthPlace: user.birthPlace,
        plan: user.plan,
      },
    });
  } catch {
    return Response.json({ user: null });
  }
}
