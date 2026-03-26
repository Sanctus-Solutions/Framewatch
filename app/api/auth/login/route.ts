import { NextResponse } from "next/server";

const SESSION_TOKEN = "framewatch_auth_token_v1";
const LOGIN_USERNAME = process.env.FRAMEWATCH_LOGIN_USERNAME ?? "tucker";
const SUPABASE_LOGIN_EMAIL =
  process.env.SUPABASE_LOGIN_EMAIL ?? "tucker@framewatch.local";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function authenticateWithSupabase(password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, reason: "Supabase auth is not configured." };
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      email: SUPABASE_LOGIN_EMAIL,
      password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { success: false, reason: "Invalid username or password" };
  }

  return { success: true, reason: null };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Keep the same username-based login UX for the MVP.
    if (username !== LOGIN_USERNAME) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const authResult = await authenticateWithSupabase(password);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.reason ?? "Invalid username or password" },
        { status: 401 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    // Set secure session cookie (httpOnly to prevent XSS)
    response.cookies.set({
      name: SESSION_TOKEN,
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
