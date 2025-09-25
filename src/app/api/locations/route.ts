import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, address FROM locations ORDER BY name');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
