const AUTH_URL = 'https://functions.poehali.dev/cc5f78a0-f2db-48ca-8c22-229a61649881';
const SESSION_KEY = 'nexus_session';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'master';
  skill: string;
}

async function call(action: string, body: Record<string, unknown> = {}, sessionId?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['X-Session-Id'] = sessionId;
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...body }),
  });
  return res.json();
}

export function getSessionId(): string {
  return localStorage.getItem(SESSION_KEY) || '';
}

export function saveSession(sessionId: string) {
  localStorage.setItem(SESSION_KEY, sessionId);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(email: string, password: string): Promise<{ user: User; session_id: string } | { error: string }> {
  return call('login', { email, password });
}

export async function register(data: { name: string; email: string; password: string; role: string; skill: string }): Promise<{ user: User; session_id: string } | { error: string }> {
  return call('register', data);
}

export async function getMe(): Promise<{ user: User } | { error: string }> {
  return call('me', {}, getSessionId());
}

export async function logout() {
  await call('logout', {}, getSessionId());
  clearSession();
}
