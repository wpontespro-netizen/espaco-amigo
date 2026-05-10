import crypto from "node:crypto";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthCookie {
  name: string;
  value: string;
  options: CookieOptions;
}

interface CookieOptions {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
}

const SESSION_COOKIE = "ea_session";
const OAUTH_STATE_COOKIE = "ea_oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const OAUTH_STATE_MAX_AGE = 60 * 10;

export function createGoogleAuthStart(baseUrl: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.AUTH_SECRET;

  if (!clientId || !secret) {
    throw new Error("Google auth is not configured. Set GOOGLE_CLIENT_ID and AUTH_SECRET.");
  }

  const state = crypto.randomBytes(24).toString("base64url");
  const signedState = signValue(state, secret);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return {
    redirectUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    cookies: [
      {
        name: OAUTH_STATE_COOKIE,
        value: signedState,
        options: baseCookieOptions(OAUTH_STATE_MAX_AGE, baseUrl),
      },
    ],
  };
}

export async function completeGoogleAuth({
  baseUrl,
  code,
  cookieHeader,
  state,
}: {
  baseUrl: string;
  code?: string;
  cookieHeader?: string;
  state?: string;
}) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const secret = process.env.AUTH_SECRET;

  if (!clientId || !clientSecret || !secret) {
    throw new Error("Google auth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and AUTH_SECRET.");
  }

  const cookies = parseCookies(cookieHeader || "");
  const signedState = cookies[OAUTH_STATE_COOKIE];
  const expectedState = signedState ? verifySignedValue(signedState, secret) : null;

  if (!code || !state || !expectedState || state !== expectedState) {
    throw new Error("Invalid Google OAuth state.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google token exchange failed: ${tokenResponse.status}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("Google did not return an access token.");
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userResponse.ok) {
    throw new Error(`Google userinfo failed: ${userResponse.status}`);
  }

  const googleUser = (await userResponse.json()) as {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
  };

  if (!googleUser.sub || !googleUser.email || !googleUser.name) {
    throw new Error("Google profile is missing required fields.");
  }

  const user: AuthUser = {
    id: googleUser.sub,
    name: googleUser.name,
    email: googleUser.email,
    picture: googleUser.picture,
  };

  return {
    user,
    cookies: [
      {
        name: SESSION_COOKIE,
        value: signValue(JSON.stringify(user), secret),
        options: baseCookieOptions(SESSION_MAX_AGE, baseUrl),
      },
      {
        name: OAUTH_STATE_COOKIE,
        value: "",
        options: { ...baseCookieOptions(0, baseUrl), maxAge: 0 },
      },
    ],
  };
}

export function getSessionUser(cookieHeader?: string): AuthUser | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const cookies = parseCookies(cookieHeader || "");
  const signedSession = cookies[SESSION_COOKIE];
  const sessionJson = signedSession ? verifySignedValue(signedSession, secret) : null;
  if (!sessionJson) return null;

  try {
    const parsed = JSON.parse(sessionJson) as AuthUser;
    if (!parsed.id || !parsed.name || !parsed.email) return null;
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      picture: parsed.picture,
    };
  } catch {
    return null;
  }
}

export function createLogoutCookie(baseUrl: string): AuthCookie {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: { ...baseCookieOptions(0, baseUrl), maxAge: 0 },
  };
}

export function serializeCookie(cookie: AuthCookie) {
  const options = cookie.options;
  const parts = [`${cookie.name}=${encodeURIComponent(cookie.value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");

  return parts.join("; ");
}

function baseCookieOptions(maxAge: number, baseUrl: string): CookieOptions {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "Lax",
    secure: baseUrl.startsWith("https://"),
  };
}

function signValue(value: string, secret: string) {
  const payload = Buffer.from(value, "utf-8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifySignedValue(signedValue: string, secret: string) {
  const [payload, signature] = signedValue.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!timingSafeEqual(signature, expectedSignature)) return null;

  return Buffer.from(payload, "base64url").toString("utf-8");
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(valueParts.join("=") || "");
    return cookies;
  }, {});
}
