import type { StudySession, QuizAttempt } from "./types";

const SESSIONS_KEY = "notegenie.sessions";
const ACTIVE_KEY = "notegenie.activeId";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSessions(): StudySession[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as StudySession[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: StudySession) {
  if (!isBrowser()) return;
  const all = getSessions();
  const next = [session, ...all.filter((s) => s.id !== session.id)];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export function updateSession(id: string, patch: Partial<StudySession>) {
  if (!isBrowser()) return;
  const all = getSessions();
  const next = all.map((s) => (s.id === id ? { ...s, ...patch } : s));
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export function getSession(id: string): StudySession | undefined {
  return getSessions().find((s) => s.id === id);
}

export function deleteSession(id: string) {
  if (!isBrowser()) return;
  const next = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export function setActiveSessionId(id: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveSessionId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function recordAttempt(id: string, attempt: QuizAttempt) {
  const session = getSession(id);
  if (!session) return;
  updateSession(id, { attempts: [...session.attempts, attempt] });
}
