import { useState } from "react";
import { getCurrentUser } from "@/services/authService";

const TABS = [
  { id: "profile", label: "Profil" },
  { id: "notifications", label: "Notifikasi" },
  { id: "security", label: "Keamanan" },
];

export default function SettingsPage() {
  const user = getCurrentUser();
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "08123456789",
  });
  const [notifications, setNotifications] = useState({
    emailReport: true,
    lowStock: true,
    dailyReminder: false,
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function save(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-slate-500">Kelola profil dan preferensi akun</p>
      </div>

      <nav className="flex flex-wrap gap-2 bg-white rounded-xl p-1 shadow-md w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "profile" && (
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl space-y-4">
          <h2 className="font-bold text-lg">Profil Akun</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">No HP</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <button
            type="button"
            onClick={() => save("Profil berhasil disimpan")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            Simpan Profil
          </button>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl space-y-4">
          <h2 className="font-bold text-lg">Preferensi Notifikasi</h2>
          {[
            { key: "emailReport", label: "Kirim laporan keuangan via email" },
            { key: "lowStock", label: "Peringatan stok menipis" },
            { key: "dailyReminder", label: "Reminder laporan harian sebelum closing" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) =>
                  setNotifications((n) => ({ ...n, [item.key]: e.target.checked }))
                }
                className="w-4 h-4"
              />
              <span>{item.label}</span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => save("Preferensi notifikasi disimpan")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            Simpan
          </button>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl space-y-4">
          <h2 className="font-bold text-lg">Keamanan</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Password Saat Ini</label>
            <input
              type="password"
              value={security.currentPassword}
              onChange={(e) =>
                setSecurity((s) => ({ ...s, currentPassword: e.target.value }))
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password Baru</label>
            <input
              type="password"
              value={security.newPassword}
              onChange={(e) =>
                setSecurity((s) => ({ ...s, newPassword: e.target.value }))
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
            <input
              type="password"
              value={security.confirmPassword}
              onChange={(e) =>
                setSecurity((s) => ({ ...s, confirmPassword: e.target.value }))
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (security.newPassword && security.newPassword === security.confirmPassword) {
                save("Password berhasil diubah");
                setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
              } else {
                save("Password baru tidak cocok");
              }
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            Ubah Password
          </button>
        </div>
      )}
    </div>
  );
}
