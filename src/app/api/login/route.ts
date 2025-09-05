import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  // In a real app, you would validate the credentials against a database
  if (email && password) {
    const response = NextResponse.json({ message: 'Login successful' });
    // Set a session cookie
    response.cookies.set('session', 'user-session-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return response;
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
