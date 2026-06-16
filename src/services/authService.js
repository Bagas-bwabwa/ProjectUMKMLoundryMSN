import { apiClient } from "./apiClient";

const SESSION_KEY = "laundry_msn_session";

/** Akun demo sesuai role di dokumen proyek */
export const DEMO_ACCOUNTS = [
  {
    email: "qucucy@gmail.com",
    password: "qucucy123",
    role: "admin",
    name: "Administrator",
    outlet: null,
  },
  {
    email: "kasir@laundrymsn.com",
    password: "kasir123",
    role: "kasir",
    name: "Andi Saputra",
    outlet: "Laundry Panam",
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
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Login multi-role: admin, kasir, investor.
 */
export async function login(credentials) {
  const email = credentials.email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email && a.password === credentials.password
  );

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
  return readSession()?.token ?? null;
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
