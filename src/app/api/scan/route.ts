import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId } = body;
    if (!cardId) {
      return NextResponse.json({ message: 'Card ID is required' }, { status: 400 });
    }
    // Trim whitespace and normalize the incoming cardId
    const rawId = String(cardId);
    const idToSearch = rawId.trim();
    console.debug('[scan] incoming cardId:', { raw: rawId, trimmed: idToSearch });

    // Try to find an asset by NFC or RFID
    try {
      const sql = `SELECT a.id, a.name, a.status, a.assignedTo, e.name AS assignedName
         FROM assets a
         LEFT JOIN employees e ON a.assignedTo = e.id
         WHERE a.nfcId = ? OR a.rfid = ? LIMIT 1`;
      console.debug('[scan] running query', { sql, params: [idToSearch, idToSearch] });
      const [rows] = await pool.query<RowDataPacket[]>(sql, [idToSearch, idToSearch]);
      console.debug('[scan] query result count:', Array.isArray(rows) ? rows.length : 0);

      if (rows && rows.length > 0) {
        const asset = rows[0];
        console.debug('[scan] matched asset', { id: asset.id, name: asset.name });
        return NextResponse.json({
          message: 'Asset scanned',
          asset: {
            id: asset.id,
            name: asset.name,
            status: asset.status,
            assignedTo: asset.assignedTo || null,
            assignedName: asset.assignedName || null,
          },
        });
      }
      console.debug('[scan] no rows matched for id', idToSearch);
    } catch (dbErr) {
      console.error('DB lookup failed for scan:', dbErr);
      // fallthrough to not found response
    }

    // fallback: return not found
    return NextResponse.json({ message: 'No asset found for this tag', asset: null }, { status: 404 });
  } catch (error) {
    console.error('Scan handler error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
