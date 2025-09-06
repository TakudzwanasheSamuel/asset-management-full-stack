import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET a single asset
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM assets WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching asset ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// PUT to update an asset
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, type, status, assignedTo, serialNumber, manufacturer, model, purchaseDate, purchasePrice, location, description, imageUrl } = body;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM assets WHERE id = ?', [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    const updates: { [key: string]: any } = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (status) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (serialNumber) updates.serialNumber = serialNumber;
    if (manufacturer) updates.manufacturer = manufacturer;
    if (model) updates.model = model;
    if (purchaseDate) updates.purchaseDate = purchaseDate;
    if (purchasePrice) updates.purchasePrice = purchasePrice;
    if (location) updates.location = location;
    if (description) updates.description = description;
    if (imageUrl) updates.imageUrl = imageUrl;

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    await pool.query('UPDATE assets SET ? WHERE id = ?', [updates, params.id]);

    const [updatedRows] = await pool.query<RowD ataPacket[]>('SELECT * FROM assets WHERE id = ?', [params.id]);

    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    console.error(`Error updating asset ${params.id}:`, error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Asset with this serial number already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an asset
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [result] = await pool.query('DELETE FROM assets WHERE id = ?', [params.id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Asset deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting asset ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
