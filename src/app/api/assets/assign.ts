import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { assetId, employeeId } = await request.json();
    if (!assetId || !employeeId) {
      return NextResponse.json({ message: 'Missing assetId or employeeId' }, { status: 400 });
    }
    // Update asset assignment
    await pool.query('UPDATE assets SET assignedTo = ? WHERE id = ?', [employeeId, assetId]);
    // Optionally, fetch updated asset
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM assets WHERE id = ?', [assetId]);
  return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error assigning asset:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
