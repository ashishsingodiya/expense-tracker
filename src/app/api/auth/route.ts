import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Auth routes not implemented yet" }, { status: 501 });
}
