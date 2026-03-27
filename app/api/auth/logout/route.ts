import { NextResponse } from "next/server";

const SESSION_TOKEN = "framewatch_auth_token_v1";

export async function POST(request: Request) {
  const response = NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 }
  );

  // Clear the session cookie
  response.cookies.set({
    name: SESSION_TOKEN,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
