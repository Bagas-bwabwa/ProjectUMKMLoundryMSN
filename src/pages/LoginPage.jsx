import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/router/paths";
import {
  APP_LOGIN_EMAIL,
  APP_LOGIN_PASSWORD,
  login as loginRequest,
} from "@/services/authService";

/** Logo statis dari folder `public` — cocok dengan basename deploy GitHub Pages. */
function logoSrc() {
  const base = import.meta.env.BASE_URL;
  return `${base}logo-qucuci.png`;
}

/** Ikon peringatan seperti badge merah dengan tanda seru (mirip referensi). */
function CredentialWarningIcon() {
  return (
    <div
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
      aria-hidden
    >
      <div className="absolute h-8 w-8 rotate-45 rounded-md bg-red-600 shadow-sm ring-2 ring-red-500/30" />
      <span className="relative text-sm font-bold leading-none text-white">
        !
      </span>
    </div>
  );
}

function LoginStatusBanner({ banner }) {
  if (!banner) return null;

  if (banner.kind === "loading") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-slate-600" />
        Mohon tunggu…
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm"
      role="alert"
      aria-live="assertive"
    >
      <CredentialWarningIcon />
      <p className="min-w-0 pt-1 text-sm font-semibold leading-snug text-red-900">
        {banner.message}
      </p>
    </div>
  );
}

/** Login admin — tema biru laundry + banner status seperti referensi (error / loading). */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    location.state?.from?.pathname ??
    ROUTES.HOME_REDIRECT;

  const [email, setEmail] = useState(APP_LOGIN_EMAIL);
  const [password, setPassword] = useState(APP_LOGIN_PASSWORD);
  const [banner, setBanner] = useState(null);

  const isLoading = banner?.kind === "loading";

  function clearErrorBannerOnEdit() {
    setBanner((b) => (b?.kind === "error" ? null : b));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const em = email.trim();
    if (!em || !password.trim()) {
      setBanner({
        kind: "error",
        message: "Email dan password wajib diisi.",
      });
      return;
    }

    setBanner({ kind: "loading" });

    try {
      await loginRequest({ email: em, password });
      navigate(from, { replace: true });
    } catch {
      setBanner({
        kind: "error",
        message: "Email atau Password Anda tidak valid.",
      });
    }
  }

  const year = new Date().getFullYear();

  return (
    <div className="w-full rounded-[1.75rem] border border-border bg-card p-8 shadow-[0_25px_60px_-15px_rgba(8,47,73,0.55)] md:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 w-full max-w-[280px] rounded-2xl bg-white p-4 shadow-inner ring-1 ring-primary/15">
          <img
            src={logoSrc()}
            alt="QUCUCI Management"
            className="mx-auto h-auto w-full max-h-[120px] object-contain"
            width={280}
            height={120}
          />
        </div>

        <h1 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.25rem]">
          Qcuci
        </h1>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
          bersih cepat, wangi melekat
        </p>

        <p className="mt-5 max-w-[320px] text-base font-semibold text-foreground">
          Selamat datang kembali{" "}
          <span className="inline-block" aria-hidden>
            👋
          </span>
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <LoginStatusBanner banner={banner} />

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-foreground" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            disabled={isLoading}
            onChange={(ev) => {
              setEmail(ev.target.value);
              clearErrorBannerOnEdit();
            }}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition-[box-shadow,border-color] placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="login-password"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={isLoading}
            onChange={(ev) => {
              setPassword(ev.target.value);
              clearErrorBannerOnEdit();
            }}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none ring-primary/20 transition-[box-shadow,border-color] focus:border-primary/50 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-[transform,background-color] hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-80"
        >
          {isLoading ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
        © {year} Qucuci Management · Panel laundry terpusat
      </p>
    </div>
  );
}
