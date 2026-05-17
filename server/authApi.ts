import crypto from "node:crypto";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider?: "google" | "credentials";
  age?: number;
  birthMonth?: string;
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

interface ProfileRow {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
  provider: "google" | "credentials";
  idade?: number | null;
  mes_nascimento?: string | null;
}

const SESSION_COOKIE = "ea_session";
const OAUTH_STATE_COOKIE = "ea_oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const OAUTH_STATE_MAX_AGE = 60 * 10;
const BIRTH_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function createGoogleAuthStart(baseUrl: string, mode = "login") {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.AUTH_SECRET;
  if (!clientId || !secret) throw new Error("Google auth is not configured.");

  const state = crypto.randomBytes(24).toString("base64url");
  const signedState = signValue(JSON.stringify({ state, mode }), secret);
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
    cookies: [{ name: OAUTH_STATE_COOKIE, value: signedState, options: baseCookieOptions(OAUTH_STATE_MAX_AGE, baseUrl) }],
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
  if (!clientId || !clientSecret || !secret) throw new Error("Google auth is not configured.");

  const cookies = parseCookies(cookieHeader || "");
  const signedState = cookies[OAUTH_STATE_COOKIE];
  const stateData = signedState ? safeJson<{ state: string; mode?: string }>(verifySignedValue(signedState, secret)) : null;
  if (!code || !state || !stateData?.state || state !== stateData.state) throw new Error("Invalid Google OAuth state.");

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
  if (!tokenResponse.ok) throw new Error(`Google token exchange failed: ${tokenResponse.status}`);

  const tokenData = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenData.access_token) throw new Error("Google did not return an access token.");

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userResponse.ok) throw new Error(`Google userinfo failed: ${userResponse.status}`);

  const googleUser = (await userResponse.json()) as { sub?: string; name?: string; email?: string; picture?: string };
  if (!googleUser.sub || !googleUser.email || !googleUser.name) throw new Error("Google profile is missing required fields.");

  const email = normalizeEmail(googleUser.email);
  const existing = await getProfileByEmail(email);
  const profile =
    existing ||
    (await upsertProfile({
      id: `google:${googleUser.sub}`,
      nome: googleUser.name,
      email,
      foto: googleUser.picture || null,
      provider: "google",
    }));
  const updated = await upsertProfile({
    ...profile,
    nome: profile.nome || googleUser.name,
    foto: googleUser.picture || profile.foto,
  });
  const user = rowToUser(updated);

  return {
    user,
    needsProfile: !user.age || !user.birthMonth,
    cookies: [
      { name: SESSION_COOKIE, value: signValue(JSON.stringify(user), secret), options: baseCookieOptions(SESSION_MAX_AGE, baseUrl) },
      { name: OAUTH_STATE_COOKIE, value: "", options: { ...baseCookieOptions(0, baseUrl), maxAge: 0 } },
    ],
  };
}

export async function createEmailAccount(baseUrl: string, payload: unknown) {
  const secret = requiredSecret();
  const data = payload as Partial<{ name: string; email: string; password: string; age: string | number; birthMonth: string }>;
  const email = normalizeEmail(data.email || "");
  const errors = validateSignup(data, email);
  if (Object.keys(errors).length) return { ok: false, errors };
  if (await getProfileByEmail(email)) return { ok: false, errors: { email: "Este email já possui uma conta." } };

  const authUser = await supabaseAuthAdmin("POST", "/admin/users", {
    email,
    password: String(data.password),
    email_confirm: true,
    user_metadata: { name: String(data.name || "").trim() },
  });
  const profile = await upsertProfile({
    id: authUser.id,
    nome: String(data.name || "").trim(),
    email,
    provider: "credentials",
    idade: Number(data.age),
    mes_nascimento: String(data.birthMonth),
  });
  const user = rowToUser(profile);
  return { ok: true, user, cookies: sessionCookies(user, secret, baseUrl) };
}

export async function loginEmailAccount(baseUrl: string, payload: unknown) {
  const secret = requiredSecret();
  const data = payload as Partial<{ email: string; password: string }>;
  const email = normalizeEmail(data.email || "");
  const errors: Record<string, string> = {};
  if (!isValidEmail(email)) errors.email = "Informe um email válido.";
  if (!data.password) errors.password = "Informe sua senha.";
  if (Object.keys(errors).length) return { ok: false, errors };

  let authResult;
  try {
    authResult = await supabaseAuthAnon("POST", "/token?grant_type=password", { email, password: data.password });
  } catch (error) {
    if (isInvalidLoginError(error)) return { ok: false, error: "Email ou senha inválidos." };
    throw error;
  }
  if (!authResult.user?.id) return { ok: false, error: "Email ou senha inválidos." };
  const profile = await getProfileByEmail(email);
  if (!profile || profile.provider !== "credentials") return { ok: false, error: "Conta não encontrada para email e senha." };

  const user = rowToUser(profile);
  return { ok: true, user, cookies: sessionCookies(user, secret, baseUrl) };
}

export async function completeUserProfile(baseUrl: string, payload: unknown, cookieHeader = "") {
  const secret = requiredSecret();
  const user = getSessionUser(cookieHeader);
  if (!user) return { ok: false, error: "Sessão não encontrada." };
  const data = payload as Partial<{ age: string | number; birthMonth: string }>;
  const errors = validateProfile(data);
  if (Object.keys(errors).length) return { ok: false, errors };

  const profile = await getProfileByEmail(user.email);
  if (!profile) return { ok: false, error: "Perfil não encontrado." };
  const updated = await upsertProfile({ ...profile, idade: Number(data.age), mes_nascimento: String(data.birthMonth) });
  const updatedUser = rowToUser(updated);
  return { ok: true, user: updatedUser, cookies: sessionCookies(updatedUser, secret, baseUrl) };
}

export async function updateUserProfile(baseUrl: string, payload: unknown, cookieHeader = "") {
  const secret = requiredSecret();
  const user = getSessionUser(cookieHeader);
  if (!user) return { ok: false, error: "Sessão não encontrada." };
  const data = payload as Partial<{ name: string; age: string | number; birthMonth: string }>;
  const errors = validateProfile(data, true);
  if (Object.keys(errors).length) return { ok: false, errors };

  const profile = await getProfileByEmail(user.email);
  if (!profile) return { ok: false, error: "Perfil não encontrado." };
  const updated = await upsertProfile({
    ...profile,
    nome: String(data.name || "").trim(),
    idade: Number(data.age),
    mes_nascimento: String(data.birthMonth),
  });
  const updatedUser = rowToUser(updated);
  return { ok: true, user: updatedUser, cookies: sessionCookies(updatedUser, secret, baseUrl) };
}

export function getSessionUser(cookieHeader?: string): AuthUser | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const signedSession = parseCookies(cookieHeader || "")[SESSION_COOKIE];
  const sessionJson = signedSession ? verifySignedValue(signedSession, secret) : null;
  if (!sessionJson) return null;
  const parsed = safeJson<AuthUser>(sessionJson);
  return parsed?.id && parsed.name && parsed.email ? parsed : null;
}

export function createLogoutCookie(baseUrl: string): AuthCookie {
  return { name: SESSION_COOKIE, value: "", options: { ...baseCookieOptions(0, baseUrl), maxAge: 0 } };
}

export function serializeCookie(cookie: AuthCookie) {
  const parts = [`${cookie.name}=${encodeURIComponent(cookie.value)}`];
  if (cookie.options.maxAge !== undefined) parts.push(`Max-Age=${cookie.options.maxAge}`);
  if (cookie.options.path) parts.push(`Path=${cookie.options.path}`);
  if (cookie.options.httpOnly) parts.push("HttpOnly");
  if (cookie.options.sameSite) parts.push(`SameSite=${cookie.options.sameSite}`);
  if (cookie.options.secure) parts.push("Secure");
  return parts.join("; ");
}

function requiredSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Auth is not configured. Set AUTH_SECRET.");
  return secret;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey || !serviceKey) throw new Error("Supabase is not configured.");
  return { url: url.replace(/\/+$/, ""), anonKey, serviceKey };
}

async function supabaseAuthAdmin(method: string, path: string, body?: unknown) {
  const { url, serviceKey } = supabaseConfig();
  return supabaseRequest(`${url}/auth/v1${path}`, method, serviceKey, body);
}

async function supabaseAuthAnon(method: string, path: string, body?: unknown) {
  const { url, anonKey } = supabaseConfig();
  return supabaseRequest(`${url}/auth/v1${path}`, method, anonKey, body);
}

async function supabaseDb(path: string, method = "GET", body?: unknown) {
  const { url, serviceKey } = supabaseConfig();
  return supabaseRequest(`${url}/rest/v1${path}`, method, serviceKey, body, { Prefer: "return=representation,resolution=merge-duplicates" });
}

async function supabaseRequest(url: string, method: string, key: string, body?: unknown, extraHeaders: Record<string, string> = {}) {
  const response = await fetch(url, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.msg || data?.message || `Supabase error ${response.status}`);
  return data;
}

async function getProfileByEmail(email: string) {
  const rows = (await supabaseDb(`/profiles?email=eq.${encodeURIComponent(email)}&limit=1`)) as ProfileRow[];
  return rows[0] || null;
}

async function upsertProfile(profile: ProfileRow) {
  const rows = (await supabaseDb("/profiles?on_conflict=email", "POST", profile)) as ProfileRow[];
  return rows[0];
}

function rowToUser(row: ProfileRow): AuthUser {
  return {
    id: row.id,
    name: row.nome,
    email: normalizeEmail(row.email),
    picture: row.foto || undefined,
    provider: row.provider,
    age: row.idade || undefined,
    birthMonth: row.mes_nascimento || undefined,
  };
}

function sessionCookies(user: AuthUser, secret: string, baseUrl: string) {
  return [{ name: SESSION_COOKIE, value: signValue(JSON.stringify(user), secret), options: baseCookieOptions(SESSION_MAX_AGE, baseUrl) }];
}

function validateSignup(data: Partial<{ name: string; password: string; age: string | number; birthMonth: string }>, email: string) {
  const errors = validateProfile(data, true);
  if (!isValidEmail(email)) errors.email = "Informe um email válido.";
  if (String(data.password || "").length < 6) errors.password = "A senha precisa ter pelo menos 6 caracteres.";
  return errors;
}

function validateProfile(data: Partial<{ name: string; age: string | number; birthMonth: string }>, requireName = false) {
  const errors: Record<string, string> = {};
  const age = Number(data.age);
  if (requireName && !String(data.name || "").trim()) errors.name = "Informe seu nome.";
  if (!String(data.age || "").trim()) errors.age = "Informe sua idade.";
  else if (!Number.isFinite(age) || age < 13) errors.age = "A idade mínima é 13 anos.";
  if (!BIRTH_MONTHS.includes(String(data.birthMonth || ""))) errors.birthMonth = "Escolha o mês de nascimento.";
  return errors;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isInvalidLoginError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /invalid login credentials|invalid credentials|supabase error 400/i.test(message);
}

function baseCookieOptions(maxAge: number, baseUrl: string): CookieOptions {
  return { httpOnly: true, maxAge, path: "/", sameSite: "Lax", secure: baseUrl.startsWith("https://") };
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
    if (name) cookies[name] = decodeURIComponent(valueParts.join("=") || "");
    return cookies;
  }, {});
}

function safeJson<T>(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
