import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[LOGIN] Attempting login for email:', email);

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM employees WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('[LOGIN] No user found for email:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    console.log('[LOGIN] User found:', { id: user.id, email: user.email, password: user.password });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('[LOGIN] Invalid password for email:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: 'Login successful' });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    console.log('[LOGIN] Login successful for email:', email);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
