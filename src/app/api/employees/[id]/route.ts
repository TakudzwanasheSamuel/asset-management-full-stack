import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

// GET a single employee
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, department, role, employeeId, avatar, hireDate, status, createdAt, updatedAt FROM employees WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching employee ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// PUT to update an employee
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, email, password, department, role, employeeId, avatar, hireDate, status } = body;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM employees WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const updates: { [key: string]: any } = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (department) updates.department = department;
    if (role) updates.role = role;
    if (employeeId) updates.employeeId = employeeId;
    if (avatar) updates.avatar = avatar;
    if (hireDate) updates.hireDate = hireDate;
    if (status) updates.status = status;

    if (password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(password, saltRounds);
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    await pool.query('UPDATE employees SET ? WHERE id = ?', [updates, params.id]);

    const [updatedRows] = await pool.query<RowDataPacket[]>('SELECT id, name, email, department, role, employeeId, avatar, hireDate, status, createdAt, updatedAt FROM employees WHERE id = ?', [params.id]);

    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    console.error(`Error updating employee ${params.id}:`, error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Email or Employee ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an employee
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [params.id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting employee ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
