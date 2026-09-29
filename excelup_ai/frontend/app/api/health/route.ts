import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({
    ok: true,
    status: "online",
    name: "EXCELUP AI Next.js Full-Stack API",
    platform: "Vercel / Next.js App Router",
    tagline: "Skilling outcomes, measured honestly.",
  });
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
