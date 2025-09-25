import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/assets/total-value?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    if (!companyId) {
      return NextResponse.json({ message: 'Missing company_id' }, { status: 400 });
    }
    // Sum purchasePrice for all assets for this company
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(purchasePrice) as totalValue FROM assets WHERE company_id = ?',
      [companyId]
    );
    return NextResponse.json({ totalValue: rows[0]?.totalValue ?? 0 });
  } catch (error) {
    console.error('Error calculating total asset value:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
