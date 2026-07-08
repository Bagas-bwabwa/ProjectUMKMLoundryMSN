import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useLocalData, getLocalData } from "@/hooks/useLocalData";
import { useApiData } from "@/hooks/useApiData";
import { getCurrentUser } from "@/services/authService";
import { formatRupiah } from "@/data/laundryData";
import { CRUD_CONFIGS } from "@/data/pageConfigs";

/** Storage keys that have a corresponding backend API endpoint */
const API_BACKED_KEYS = new Set(["outlets", "services", "items", "expenses"]);

function badgeClass(color) {
  const map = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return map[color] ?? "bg-slate-100 text-slate-700";
}

function getFieldOptions(field) {
  if (field.options) return field.options;
  if (field.optionsFrom) {
    const cfg = CRUD_CONFIGS[field.optionsFrom];
    if (!cfg) return [];
    const data = getLocalData(cfg.storageKey, cfg.initialData);
    return data.map((item) => item[field.optionKey ?? "nama"]);
  }
  return [];
}

function emptyForm(fields) {
  const form = {};
  fields.forEach((f) => {
    form[f.key] = f.default ?? (f.type === "number" ? "" : "");
  });
  return form;
}

function renderCell(col, row) {
  let value = row[col.key];

  if (col.render) {
    const result = col.render(row);
    if (col.badge && result?.label) {
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${badgeClass(result.color)}`}>
          {result.label}
        </span>
      );
    }
    return result;
  }

  if (col.format === "rupiah") {
    value = formatRupiah(value ?? 0);
  } else if (col.suffix) {
    value = `${value}${col.suffix}`;
  } else if (value == null || value === "") {
    value = col.empty ?? "—";
  }

  if (col.badge) {
    const isActive = value === "Aktif" || value === "Dibayar" || value === "Selesai";
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {value}
      </span>
    );
  }

  const colorClass =
    col.color === "red"
      ? "text-red-600 font-semibold"
      : col.color === "green"
        ? "text-green-600 font-semibold"
        : col.bold
          ? "font-medium"
          : "";

  return <span className={colorClass}>{value}</span>;
}

export function CrudPage({ configKey }) {
  const config = CRUD_CONFIGS[configKey];
  const user = getCurrentUser();
  const useApiBacked = API_BACKED_KEYS.has(config.storageKey);
  const apiHook = useApiData(config.storageKey, config.initialData);
  const localHook = useLocalData(config.storageKey, config.initialData);
  const { data, add, update, remove } = useApiBacked ? apiHook : localHook;

  // Search & Filter
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(config.fields));
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = useMemo(() => {
    let list = data;
    if (config.filterByKasir && user?.role === "kasir") {
      list = list.filter((item) => item[config.filterByKasir] === user.outlet);
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((item) =>
      config.searchKeys.some((key) =>
        String(item[key] ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, search, config, user]);

  function openAdd() {
    const initial = emptyForm(config.fields);
    if (config.filterByKasir && user?.role === "kasir") {
      initial[config.filterByKasir] = user.outlet;
    }
    if (configKey === "dailyReports") {
      initial.kasir = user?.name ?? "";
      initial.status = "Draft";
    }
    setForm(initial);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    if (config.canEdit && !config.canEdit(row)) return;
    const values = {};
    config.fields.forEach((f) => {
      values[f.key] = row[f.key] ?? "";
    });
    setForm(values);
    setEditId(row.id);
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    for (const f of config.fields) {
      if (f.required && !String(form[f.key] ?? "").trim()) {
        showToast(`${f.label} wajib diisi`);
        return;
      }
    }

    const payload = { ...form };
    config.fields.forEach((f) => {
      if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
    });

    if (configKey === "dailyReports" && !editId) {
      payload.status = "Draft";
    }

    if (editId) {
      update(editId, payload);
      showToast("Data berhasil diperbarui");
    } else {
      add(payload);
      showToast("Data berhasil ditambahkan");
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteId) {
      remove(deleteId);
      showToast("Data berhasil dihapus");
      setDeleteId(null);
    }
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{config.title}</h1>
          <p className="text-slate-500">{config.subtitle}</p>
        </div>
        {user?.role !== "investor" && (
          <button
            onClick={openAdd}
            type="button"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <Plus size={18} />
            {config.addLabel}
          </button>
        )}
      </div>

      {configKey === "dailyReports" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          Laporan yang sudah disubmit tidak dapat diubah. Pastikan data sudah benar sebelum submit.
        </div>
      )}

      {config.summary && (
        <div
          className={`grid grid-cols-1 gap-5 mb-6 ${
            config.summary.length >= 3
              ? "md:grid-cols-3"
              : config.summary.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-1"
          }`}
        >
          {config.summary.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-slate-500">{s.label}</p>
              <h2
                className={`text-2xl font-bold mt-1 ${s.color === "red" ? "text-red-600" : ""}`}
              >
                {s.calc(data)}
              </h2>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-md mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              {config.columns.map((col) => (
                <th key={col.key} className="p-4 text-left">
                  {col.label}
                </th>
              ))}
              {user?.role !== "investor" && (
                <th className="p-4 text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t hover:bg-slate-50">
                {config.columns.map((col) => (
                  <td key={col.key} className="p-4">
                    {renderCell(col, row)}
                  </td>
                ))}
                {user?.role !== "investor" && (
                  <td className="p-4">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {config.detailPath && (
                        <Link
                          to={`${config.detailPath}/${row.id}`}
                          className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200"
                        >
                          <Eye size={18} />
                        </Link>
                      )}
                      {config.rowActions?.map((action) =>
                        action.show(row) ? (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => action.onClick(row, { update })}
                            className={action.className}
                          >
                            {action.label}
                          </button>
                        ) : null
                      )}
                      {(!config.canEdit || config.canEdit(row)) && (
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {!config.hideDelete && (
                        <button
                          type="button"
                          onClick={() => setDeleteId(row.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="p-8 text-center text-slate-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editId ? "Edit Data" : config.addLabel}
        onClose={() => setModalOpen(false)}
        wide
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {config.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="block mb-1 font-medium text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    disabled={
                      config.filterByKasir === field.key && user?.role === "kasir"
                    }
                    className="w-full border rounded-xl px-4 py-3"
                    required={field.required}
                  >
                    <option value="">Pilih...</option>
                    {getFieldOptions(field).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    rows={3}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    disabled={
                      config.filterByKasir === field.key && user?.role === "kasir"
                    }
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        message="Yakin ingin menghapus data ini?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export const OutletPage = () => <CrudPage configKey="outlets" />;
export const EmployeePage = () => <CrudPage configKey="employees" />;
export const KasirAccountPage = () => <CrudPage configKey="kasirAccounts" />;
export const InvestorPage = () => <CrudPage configKey="investors" />;
export const ServicePage = () => <CrudPage configKey="services" />;
export const ItemPage = () => <CrudPage configKey="items" />;
export const StockPage = () => <CrudPage configKey="stocks" />;
export const ExpensePage = () => <CrudPage configKey="expenses" />;
export const MaterialUsagePage = () => <CrudPage configKey="materials" />;
export const SalaryPage = () => <CrudPage configKey="salary" />;
export const DailyReportPage = () => <CrudPage configKey="dailyReports" />;
