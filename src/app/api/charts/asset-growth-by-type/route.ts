import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/charts/asset-growth-by-type?company_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    if (!companyId) {
      return NextResponse.json({ message: 'Missing company_id' }, { status: 400 });
    }
    // Get asset type counts per month for the last 6 months
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(purchaseDate, '%b %Y') as month, 
        SUM(type = 'Laptop') as laptops,
        SUM(type = 'Monitor') as monitors,
        SUM(type = 'Phone') as phones
      FROM assets
      WHERE company_id = ? AND purchaseDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY MIN(purchaseDate)`,
      [companyId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching asset growth by type:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
