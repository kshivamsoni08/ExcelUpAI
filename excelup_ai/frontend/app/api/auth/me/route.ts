import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/server/store";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  let user = DEMO_USERS["priya.patil@demo.trainee"].user;

  if (token && token.startsWith("user_")) {
    try {
      const email = Buffer.from(token.replace("user_", ""), "base64").toString("utf-8");
      if (DEMO_USERS[email]) user = DEMO_USERS[email].user;
    } catch {}
  }

  const res = NextResponse.json(user);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
