import { api, apiClient } from "./apiClient";
import { getLocalData } from "@/hooks/useLocalData";
import { kasirAccounts as initialKasirAccounts } from "@/data/laundryData";

const SESSION_KEY = "laundry_msn_session";

/** Akun demo admin & investor */
export const DEMO_ACCOUNTS = [
  {
    email: "qucucy@gmail.com",
    password: "qucucy123",
    role: "admin",
    name: "Administrator",
    outlet: null,
  },
  {
    email: "investor@laundrymsn.com",
    password: "investor123",
    role: "investor",
    name: "Budi Santoso",
    investorId: 1,
    investedOutlets: ["Laundry Panam"],
  },
  {
    email: "investor.arengka@laundrymsn.com",
    password: "investor123",
    role: "investor",
    name: "Andi Wijaya",
    investorId: 2,
    investedOutlets: ["Laundry Arengka"],
  },
  {
    email: "investor.marpoyan@laundrymsn.com",
    password: "investor123",
    role: "investor",
    name: "Rina Putri",
    investorId: 3,
    investedOutlets: ["Laundry Marpoyan"],
  },
  {
    email: "investor.sail@laundrymsn.com",
    password: "investor123",
    role: "investor",
    name: "Hendra Gunawan",
    investorId: 4,
    investedOutlets: ["Laundry Sail"],
  },
  {
    email: "investor.kulim@laundrymsn.com",
    password: "investor123",
    role: "investor",
    name: "Siti Aminah",
    investorId: 5,
    investedOutlets: ["Laundry Kulim"],
  },
];

export const APP_LOGIN_EMAIL = DEMO_ACCOUNTS[0].email;
export const APP_LOGIN_PASSWORD = DEMO_ACCOUNTS[0].password;

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem("authToken", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));
  } else {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

function normalizeApiSession(payload) {
  const token = payload?.token ?? payload?.accessToken ?? payload?.data?.token ?? null;
  const apiUser = payload?.user ?? payload?.data?.user ?? payload?.data ?? null;
  if (!token || !apiUser) return null;

  const user = {
    email: apiUser.email ?? "",
    name: apiUser.name ?? apiUser.nama ?? "User",
    role: apiUser.role ?? "admin",
    outlet: apiUser.outlet ?? null,
    kasirId: apiUser.kasirId ?? null,
    investorId: apiUser.investorId ?? null,
    investedOutlets: apiUser.investedOutlets ?? [],
  };
  return { token, user };
}

function findKasirAccount(email, password) {
  const accounts = getLocalData("kasirAccounts", initialKasirAccounts);
  return accounts.find(
    (k) =>
      k.username.toLowerCase() === email &&
      k.password === password &&
      k.status === "Aktif"
  );
}

/**
 * Login multi-role: admin, kasir (per outlet), investor.
 */
export async function login(credentials) {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;
  try {
    const response = await api.auth.login({ email, password });
    const normalized = normalizeApiSession(response?.data);
    if (normalized) {
      writeSession(normalized);
      return normalized;
    }
  } catch {
    // Fallback ke akun demo/local jika backend auth belum aktif.
  }

  let account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email && a.password === password
  );

  if (!account) {
    const kasir = findKasirAccount(email, password);
    if (kasir) {
      account = {
        email: kasir.username,
        role: "kasir",
        name: kasir.nama,
        outlet: kasir.outlet,
        kasirId: kasir.id,
      };
    }
  }

  if (!account) {
    throw new Error("Email atau password salah.");
  }

  try {
    await apiClient.get("/users", { params: { page: 1, per_page: 1 } });
  } catch {
    // Demo mode — login tetap berhasil tanpa API eksternal.
  }

  const id =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : String(Date.now());

  const session = {
    token: `laundry_msn_${id}`,
    user: {
      email: account.email,
      name: account.name,
      role: account.role,
      outlet: account.outlet ?? null,
      kasirId: account.kasirId ?? null,
      investorId: account.investorId ?? null,
      investedOutlets: account.investedOutlets ?? [],
    },
  };

  writeSession(session);
  return session;
}

export function logout() {
  writeSession(null);
}

export function getStoredToken() {
  return readSession()?.token ?? localStorage.getItem("authToken") ?? null;
}

export function getCurrentUser() {
  return readSession()?.user ?? null;
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

/** Outlet yang boleh dilihat investor yang sedang login. */
export function getInvestedOutlets() {
  const user = getCurrentUser();
  if (!user || user.role !== "investor") return [];
  return user.investedOutlets ?? [];
}

/** Daftar akun kasir untuk ditampilkan di halaman login. */
export function getKasirDemoAccounts() {
  return getLocalData("kasirAccounts", initialKasirAccounts).filter(
    (k) => k.status === "Aktif"
  );
}
