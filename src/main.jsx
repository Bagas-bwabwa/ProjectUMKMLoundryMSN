import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { App } from "./App";

const rootEl = document.getElementById("app");
if (!rootEl) {
  throw new Error('Elemen root "#app" tidak ditemukan.');
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
