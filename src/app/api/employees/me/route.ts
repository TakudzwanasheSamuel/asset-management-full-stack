export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    let payload: string | jwt.JwtPayload | undefined;
    try {
      payload = jwt.verify(session.value, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }
    if (!payload || typeof payload === 'string' || !('id' in payload)) {
      return NextResponse.json({ message: 'Invalid session payload' }, { status: 401 });
    }
    const userId = (payload as jwt.JwtPayload).id as string;
    const body = await request.json();
    // Only allow updating certain fields
    const { name, email, password, avatar, department, role, employeeId, status, hireDate } = body;
    // If password is provided, hash it (not implemented here)
    // Update employee
    const hireDateValue = hireDate === '' ? null : hireDate;
    await pool.query(
      `UPDATE employees SET name = ?, email = ?, avatar = ?, department = ?, role = ?, employeeId = ?, status = ?, hireDate = ? WHERE id = ?`,
      [name, email, avatar, department, role, employeeId, status, hireDateValue, userId]
    );
    // Return updated user
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, avatar, department, role, employeeId, status, hireDate FROM employees WHERE id = ?',
      [userId]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    let payload: string | jwt.JwtPayload | undefined;
    try {
      payload = jwt.verify(session.value, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }
    if (!payload || typeof payload === 'string' || !('id' in payload)) {
      return NextResponse.json({ message: 'Invalid session payload' }, { status: 401 });
    }
    const userId = (payload as jwt.JwtPayload).id as string;
    await pool.query('DELETE FROM employees WHERE id = ?', [userId]);
    return NextResponse.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    let payload: string | jwt.JwtPayload | undefined;
    try {
      payload = jwt.verify(session.value, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }
    if (!payload || typeof payload === 'string' || !('id' in payload)) {
      return NextResponse.json({ message: 'Invalid session payload' }, { status: 401 });
    }
    const userId = (payload as jwt.JwtPayload).id as string;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, company_id FROM employees WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
