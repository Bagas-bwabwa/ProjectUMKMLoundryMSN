import axios from "axios";

/**
 * Client HTTP terpusat (materi: Axios).
 * Reqres menyediakan endpoint /login untuk demo tanpa backend lokal.
 */
export const apiClient = axios.create({
  baseURL: "https://reqres.in/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});
