import { v4 as uuidv4 } from "uuid";

const SESSION_ID_KEY = "app_session_id";

function generateSessionId(): string {
  return uuidv4();
}
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "ssr_session";
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

export function clearSessionId(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_ID_KEY);
  }
}

export function hasSessionId(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(SESSION_ID_KEY) !== null;
}
