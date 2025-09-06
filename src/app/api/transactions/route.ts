import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET recent transactions
export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT
        t.id, t.type, t.date, t.notes, t.condition,
        a.id as assetId, a.name as assetName,
        e.id as employeeId, e.name as employeeName
      FROM transactions t
      JOIN assets a ON t.assetId = a.id
      JOIN employees e ON t.employeeId = e.id
      ORDER BY t.date DESC
      LIMIT 10;
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST a new transaction
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const body = await request.json();
    const { assetId, employeeId, type, notes, condition, createdBy } = body;

    if (!assetId || !employeeId || !type || !createdBy) {
      await connection.rollback();
      return NextResponse.json({ message: 'assetId, employeeId, createdBy, and type are required' }, { status: 400 });
    }

    // Insert the transaction
    const [result] = await connection.query(
      'INSERT INTO transactions (assetId, employeeId, type, notes, `condition`, createdBy) VALUES (?, ?, ?, ?, ?, ?)',
      [assetId, employeeId, type, notes, condition, createdBy]
    );
    const insertId = (result as any).insertId;

    // Update the asset status
    const newStatus = type === 'Check-Out' ? 'Checked Out' : 'Available';
    const assignedTo = type === 'Check-Out' ? employeeId : null;

    await connection.query(
      'UPDATE assets SET status = ?, assignedTo = ? WHERE id = ?',
      [newStatus, assignedTo, assetId]
    );

    await connection.commit();

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM transactions WHERE id = ?', [insertId]);

    return NextResponse.json(rows[0], { status: 201 });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating transaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    connection.release();
  }
}
