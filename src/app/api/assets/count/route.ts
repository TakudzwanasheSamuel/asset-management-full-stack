import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/assets/count?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    if (!companyId) {
      return NextResponse.json({ message: 'Missing company_id' }, { status: 400 });
    }
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM assets WHERE company_id = ?',
      [companyId]
    );
    return NextResponse.json({ total: rows[0]?.total ?? 0 });
  } catch (error) {
    console.error('Error counting assets:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
