import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/companies/[id]
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, address FROM companies WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
