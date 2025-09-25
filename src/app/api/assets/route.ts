import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all assets with optional search and filter
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const status = searchParams.get('status');
  const company_id = searchParams.get('company_id'); // Add company filtering

  try {
    let query = 'SELECT * FROM assets WHERE deleted_at IS NULL';
    const params: (string | number)[] = [];
    const conditions: string[] = [];
    
    // Always filter by company if provided (multi-tenant support)
    if (company_id) {
      conditions.push('company_id = ?');
      params.push(company_id);
    }

    if (search) {
      conditions.push('name LIKE ? OR serialNumber LIKE ?');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
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
    const payload = { ...body } as Record<string, any>;

    // Basic validation
    if (!payload.name || !payload.type) {
      return NextResponse.json({ message: 'Name and type are required' }, { status: 400 });
    }

    // Determine which columns actually exist in the assets table to avoid inserting unknown columns
    const dbName = process.env.DB_DATABASE ?? '';
    const [colsRows] = await pool.query<RowDataPacket[]>(
      'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [dbName, 'assets']
    );

    const existingCols = new Set(colsRows.map((r: any) => r.COLUMN_NAME));

    // Allowed columns we accept from the API (maps to DB columns where present)
    const accepted = [
  'company_id','name','type','status','assignedTo','serialNumber','manufacturer','model','purchaseDate','purchasePrice','location_id','description','nfcId','rfid'
    ];

    const insertCols: string[] = [];
    const params: any[] = [];

    for (const key of accepted) {
      if (key in payload && payload[key] !== undefined) {
        if (existingCols.has(key)) {
          insertCols.push(key);
          // treat empty string as null for optional numeric/date fields
          params.push(payload[key] === '' ? null : payload[key]);
        }
      }
    }

    // map camelCase locationId from clients to DB column location_id if provided
    if (!('location_id' in payload) && 'locationId' in payload) {
      payload.location_id = payload.locationId === 'none' || payload.locationId === undefined ? null : Number(payload.locationId);
      // if location_id available and accepted/existing, ensure it's included
      if (existingCols.has('location_id') && !insertCols.includes('location_id')) {
        insertCols.push('location_id');
        params.push(payload.location_id);
      }
    }

    // map camelCase companyId to DB column company_id; if DB requires company_id and none provided, try DEFAULT_COMPANY_ID
    if (!('company_id' in payload) && 'companyId' in payload) {
      payload.company_id = payload.companyId === 'none' || payload.companyId === undefined ? null : Number(payload.companyId);
      if (existingCols.has('company_id') && !insertCols.includes('company_id')) {
        insertCols.push('company_id');
        params.push(payload.company_id);
      }
    }

    if (existingCols.has('company_id') && !insertCols.includes('company_id')) {
      // No company_id provided by client. Try to use DEFAULT_COMPANY_ID env if set.
      const defaultCompany = process.env.DEFAULT_COMPANY_ID;
      if (defaultCompany) {
        insertCols.push('company_id');
        params.push(Number(defaultCompany));
        payload.company_id = Number(defaultCompany);
      } else {
        return NextResponse.json({ message: 'company_id is required' }, { status: 400 });
      }
    }

    if (insertCols.length === 0) {
      return NextResponse.json({ message: 'No valid asset fields found to insert (DB schema may be missing expected columns).' }, { status: 400 });
    }

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO assets (${insertCols.join(', ')}) VALUES (${placeholders})`;

    const [result] = await pool.query(sql, params);
    const insertId = (result as any).insertId;

    // Select back the columns that exist to return the created row
  const acceptedSelects = ['id','name','type','status','assignedTo','serialNumber','manufacturer','model','purchaseDate','purchasePrice','location_id','description','nfcId','rfid','createdAt','updatedAt'];
  const selectCols = Array.from(existingCols).filter((c) => acceptedSelects.includes(c));
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT ${selectCols.join(', ')} FROM assets WHERE id = ?`, [insertId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Asset with this serial number already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
