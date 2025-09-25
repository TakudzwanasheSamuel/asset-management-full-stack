import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/transactions/pending-returns?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    if (!companyId) {
      return NextResponse.json({ message: 'Missing company_id' }, { status: 400 });
    }
    // Count assets that are checked out and belong to this company
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM assets WHERE company_id = ? AND status = 'Checked Out'`,
      [companyId]
    );
    return NextResponse.json({ total: rows[0]?.total ?? 0 });
  } catch (error) {
    console.error('Error counting pending returns:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
