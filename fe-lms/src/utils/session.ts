import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "./Const";

export interface UserSession {
  token: string;
  role: "manager" | "student";
  name: string;
  email: string;
}

export function getSession(): UserSession | null {
  const sessionString = secureLocalStorage.getItem(STORAGE_KEY);
  if (!sessionString) {
    return null;
  }

  try {
    return JSON.parse(sessionString.toString()) as UserSession;
  } catch (error) {
    console.error("Failed to parse session data:", error);
    secureLocalStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setSession(session: UserSession) {
  secureLocalStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  secureLocalStorage.removeItem(STORAGE_KEY);
}
