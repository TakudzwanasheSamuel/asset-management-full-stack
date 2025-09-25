import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
function getSession(request: NextRequest) {
  const cookie = request.cookies.get("session")?.value;
  if (!cookie) return null;
  try {
    return jwt.verify(cookie, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// GET: Fetch current company details for logged-in admin
export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session || typeof session !== "object" || !("company_id" in session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const company_id = (session as any).company_id;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM companies WHERE id = ? LIMIT 1",
      [company_id]
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 });
  }
}

// PUT: Update current company details for logged-in admin
export async function PUT(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session || typeof session !== "object" || !("company_id" in session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const company_id = (session as any).company_id;
    const body = await request.json();
    await pool.query(
      "UPDATE companies SET name = ?, address = ? WHERE id = ?",
      [body.name, body.address, company_id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update company details" }, { status: 500 });
  }
}
