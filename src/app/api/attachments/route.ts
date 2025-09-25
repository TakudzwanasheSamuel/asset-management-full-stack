import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
// using built-in formData file.type and local storage only (no external deps)

// POST /api/attachments - accepts multipart/form-data with a file field named 'file' and optional asset_id, uploaded_by
export async function POST(request: NextRequest) {
  try {
    // Use the Web FormData API available on the Next.js Request to parse multipart
    const formData = await request.formData();
    const file = formData.get('file') as any;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const filename = file.name || `upload-${Date.now()}`;
    const buffer = await file.arrayBuffer();

    // server-side validation: use the reported mime type and enforce image types and max size 5MB
    const detectedMime = file.type || '';
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(detectedMime)) {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 400 });
    }
    const size = buffer.byteLength;
    if (size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 });
    }
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // ensure directory exists
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // sanitize filename a bit
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const outName = `${Date.now()}-${safeName}`;
  const outPath = path.join(uploadsDir, outName);
  fs.writeFileSync(outPath, Buffer.from(buffer));
  const fileUrl = `/uploads/${path.basename(outPath)}`;

    // optional fields
    const assetIdRaw = formData.get('asset_id');
    const uploadedByRaw = formData.get('uploaded_by');
    const fileType = formData.get('file_type')?.toString() ?? undefined;

    const asset_id = assetIdRaw ? Number(assetIdRaw.toString()) : null;
    const uploaded_by = uploadedByRaw ? Number(uploadedByRaw.toString()) : null;

    // insert attachment record
    const [result] = await pool.query<any>(
      'INSERT INTO attachments (asset_id, file_url, file_type, uploaded_by) VALUES (?, ?, ?, ?)',
      [asset_id, fileUrl, fileType ?? null, uploaded_by]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM attachments WHERE id = ?`, [insertId]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM attachments ORDER BY uploaded_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/attachments - accepts JSON body { id: number }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!id) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM attachments WHERE id = ?`, [id]);
    if (rows.length === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const fileUrl = (rows[0] as any).file_url as string;

    // delete DB record
    await pool.query('DELETE FROM attachments WHERE id = ?', [id]);

    // remove the file from disk or S3
    if (fileUrl) {
      if (fileUrl.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Failed to remove file from disk:', err);
        }
      }
    }

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
