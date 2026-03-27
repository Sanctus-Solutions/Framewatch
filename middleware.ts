import { NextRequest, NextResponse } from "next/server";

const SESSION_TOKEN = "framewatch_auth_token_v1";
const PUBLIC_ROUTES = ["/login", "/api/auth/login"];
const SESSION_SECRET = process.env.FRAMEWATCH_SESSION_SECRET ?? "";

function decodeBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLength);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function createSignature(input: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return new Uint8Array(signature);
}

async function verifySessionToken(token: string) {
  if (!SESSION_SECRET) {
    return false;
  }

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return false;
  }

  const expectedSignature = await createSignature(payloadPart, SESSION_SECRET);
  const providedSignature = decodeBase64Url(signaturePart);

  if (providedSignature.length !== expectedSignature.length) {
    return false;
  }

  for (let i = 0; i < expectedSignature.length; i += 1) {
    if (providedSignature[i] !== expectedSignature[i]) {
      return false;
    }
  }

  const payloadJson = new TextDecoder().decode(decodeBase64Url(payloadPart));
  const payload = JSON.parse(payloadJson) as { exp?: number };

  if (!payload.exp || Number.isNaN(payload.exp)) {
    return false;
  }

  return payload.exp > Date.now();
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(SESSION_TOKEN);
  const hasValidSession = Boolean(
    sessionCookie && (await verifySessionToken(sessionCookie.value))
  );

  // If already authenticated, don't allow lingering on /login.
  if (pathname === "/login" && hasValidSession) {
    const homeUrl = new URL("/", request.url);
    const response = NextResponse.redirect(homeUrl);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // If no valid session, redirect to login
  if (!hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static files and APIs
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
