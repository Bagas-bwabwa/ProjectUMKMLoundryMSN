import { apiClient } from "./apiClient";

const TOKEN_KEY = "pertemuan7_auth_token";

/** Akun aplikasi Laundry Qucuci (validasi di klien). */
export const APP_LOGIN_EMAIL = "qucucy@gmail.com";
export const APP_LOGIN_PASSWORD = "qucucy123";

/**
 * Login akun Laundry Qucuci: validasi di aplikasi.
 * Panggilan Axios ke Reqres bersifat tambahan (demo HTTP); jika jaringan diblokir
 * atau API error, login tetap berhasil selama email/password cocok.
 */
export async function login(credentials) {
  const emailOk =
    credentials.email.trim().toLowerCase() === APP_LOGIN_EMAIL.toLowerCase();
  const passwordOk = credentials.password === APP_LOGIN_PASSWORD;

  if (!emailOk || !passwordOk) {
    throw new Error("Email atau password salah.");
  }

  try {
    await apiClient.get("/users", { params: { page: 1, per_page: 1 } });
  } catch {
    // Jangan gagalkan login: banyak lingkungan memblokir/membatasi req keluar.
  }

  const id =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : String(Date.now());
  const token = `qucuci_${id}`;
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}
