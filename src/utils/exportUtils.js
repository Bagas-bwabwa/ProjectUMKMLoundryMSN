/** Ekspor laporan ke CSV (Excel) dan PDF */

function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToExcel(rows, columns, filename = "laporan") {
  const header = columns.map((c) => escapeCsv(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsv(c.getValue(row))).join(","))
    .join("\n");
  const csv = `\uFEFF${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(title, htmlContent) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html><head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        p.meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; }
        tr:nth-child(even) { background: #f8fafc; }
      </style>
    </head><body>
      <h1>${title}</h1>
      <p class="meta">Dicetak: ${new Date().toLocaleString("id-ID")}</p>
      ${htmlContent}
      <script>window.onload = () => { window.print(); };</script>
    </body></html>
  `);
  win.document.close();
}

export function tableToHtml(rows, columns) {
  const th = columns.map((c) => `<th>${c.label}</th>`).join("");
  const tbody = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${c.getValue(row)}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${tbody}</tbody></table>`;
}
