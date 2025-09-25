import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// GET all employees with optional search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    // Get session cookie and decode company_id
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
    if (!payload || typeof payload === 'string' || !('company_id' in payload)) {
      return NextResponse.json({ message: 'Invalid session payload' }, { status: 401 });
    }
    const companyId = (payload as jwt.JwtPayload).company_id;

    let query = 'SELECT id, name, email, department, role, employeeId, avatar, hireDate, status, createdAt, updatedAt FROM employees WHERE company_id = ?';
    const params: (string | number)[] = [companyId];

    if (search) {
      query += ' AND (name LIKE ? OR role LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, department, role, employeeId, avatar, hireDate, status, company_id } = body;

    if (!name || !email || !password || !company_id) {
      return NextResponse.json({ message: 'Name, email, password, and company_id are required' }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO employees (name, email, password, department, role, employeeId, avatar, hireDate, status, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, department, role, employeeId, avatar, hireDate, status, company_id]
    );

    const insertId = (result as any).insertId;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, email, department, role, employeeId, avatar, hireDate, status, createdAt, updatedAt FROM employees WHERE id = ?', [insertId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    // Check for duplicate entry error
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Email or Employee ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
