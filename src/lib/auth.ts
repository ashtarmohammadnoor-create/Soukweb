import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { Role } from "@prisma/client";

const SESSION_COOKIE = "webshop_session";
const encoder = new TextEncoder();

type SessionPayload = {
  userId: string;
  email: string;
  role: Role;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET");
  }
  return encoder.encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export async function requireUser() {
  return requireUserForLocale("en");
}

export async function requireUserForLocale(locale: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/login`);
  }
  return session;
}

export async function requireAdmin() {
  return requireAdminForLocale("en");
}

export async function requireAdminForLocale(locale: string) {
  const session = await requireUserForLocale(locale);
  if (session.role !== Role.ADMIN) {
    redirect(`/${locale}`);
  }
  return session;
}

export async function requireAdminApi() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return null;
  }
  return session;
}

export const sessionCookieName = SESSION_COOKIE;
export type { SessionPayload };
