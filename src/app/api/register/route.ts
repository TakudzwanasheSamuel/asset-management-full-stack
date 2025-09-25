import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { companyName, companyAddress, name, email, password } = await req.json();
    console.log('[REGISTER] Received:', { companyName, companyAddress, name, email });
    if (!companyName || !name || !email || !password) {
      console.log('[REGISTER] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      // Check if email already exists
      const [existing]: any = await connection.query(
        'SELECT id FROM employees WHERE email = ?',
        [email]
      );
      if (existing.length > 0) {
        console.log('[REGISTER] Email already registered:', email);
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      // 1. Create company
      const [companyResult]: any = await connection.query(
        'INSERT INTO companies (name, address) VALUES (?, ?)',
        [companyName, companyAddress || null]
      );
      const companyId = companyResult.insertId;
      console.log('[REGISTER] Company created with ID:', companyId);

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('[REGISTER] Password hashed:', hashedPassword);

      // 3. Create employee (admin)
      const [employeeResult]: any = await connection.query(
        'INSERT INTO employees (company_id, name, email, password, status) VALUES (?, ?, ?, ?, ?)',
        [companyId, name, email, hashedPassword, 'Active']
      );
      const employeeId = employeeResult.insertId;
      console.log('[REGISTER] Employee created with ID:', employeeId);

      // 4. Optionally assign admin role (if you have roles logic)
      // await connection.query('INSERT INTO user_roles (employee_id, role_id) VALUES (?, ?)', [employeeId, 1]);

      return NextResponse.json({ success: true, companyId, employeeId });
    } catch (err) {
      console.error('[REGISTER] DB error:', err);
      throw err;
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    console.error('[REGISTER] Registration failed:', error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Registration failed', details }, { status: 500 });
  }
}
