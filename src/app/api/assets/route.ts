import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all assets with optional search and filter
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  try {
    let query = 'SELECT * FROM assets';
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push('name LIKE ? OR serialNumber LIKE ?');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST a new asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, status, assignedTo, serialNumber, manufacturer, model, purchaseDate, purchasePrice, location, description, imageUrl } = body;

    if (!name || !type) {
      return NextResponse.json({ message: 'Name and type are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO assets (name, type, status, assignedTo, serialNumber, manufacturer, model, purchaseDate, purchasePrice, location, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, status, assignedTo, serialNumber, manufacturer, model, purchaseDate, purchasePrice, location, description, imageUrl]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM assets WHERE id = ?', [insertId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Asset with this serial number already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
