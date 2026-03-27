import { NextResponse } from "next/server";

const SESSION_TOKEN = "framewatch_auth_token_v1";
const LOGIN_USERNAME = process.env.FRAMEWATCH_LOGIN_USERNAME ?? "tucker";
const SUPABASE_LOGIN_EMAIL =
  process.env.SUPABASE_LOGIN_EMAIL ?? "tucker@framewatch.local";
const SESSION_SECRET = process.env.FRAMEWATCH_SESSION_SECRET ?? "";

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

function toBase64Url(bytes: Uint8Array) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function signPayload(payloadPart: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadPart));
  return toBase64Url(new Uint8Array(signature));
}

async function createSessionToken() {
  const now = Date.now();
  const payload = {
    sub: "framewatch",
    iat: now,
    exp: now + 24 * 60 * 60 * 1000,
    nonce: crypto.randomUUID(),
  };

  const payloadPart = toBase64Url(Buffer.from(JSON.stringify(payload), "utf8"));
  const signaturePart = await signPayload(payloadPart, SESSION_SECRET);

  return `${payloadPart}.${signaturePart}`;
}

export async function POST(request: Request) {
  try {
    if (!SESSION_SECRET) {
      return NextResponse.json(
        { error: "Session secret is not configured" },
        { status: 500 }
      );
    }

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

    const sessionToken = await createSessionToken();

    // Set signed and expiring session cookie (httpOnly to prevent XSS)
    response.cookies.set({
      name: SESSION_TOKEN,
      value: sessionToken,
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
