import {
  ArrowLeft,
  Users,
  Wallet,
  Receipt,
  Building2,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

export default function OutletDetail() {

  const { id } = useParams();

  const outlet = {
    id,
    nama: "Laundry Panam",
    alamat: "Jl. HR Soebrantas No.88",
    telepon: "08123456789",
    status: "Aktif",

    totalKaryawan: 5,
    totalInvestor: 2,
    totalTransaksi: 325,

    pendapatan: 12500000,
  };

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Detail Outlet
          </h1>

          <p className="text-slate-500">
            Informasi lengkap outlet
          </p>

        </div>

        <Link
          to="/outlets"
          className="
          flex items-center gap-2
          bg-slate-200
          px-4 py-3
          rounded-xl
          hover:bg-slate-300
          "
        >
          <ArrowLeft size={18}/>
          Kembali
        </Link>

      </div>

      {/* Profil Outlet */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-4 mb-4">

          <div
            className="
            w-16 h-16
            rounded-2xl
            bg-cyan-100
            flex items-center justify-center
            "
          >
            <Building2
              size={32}
              className="text-cyan-600"
            />
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {outlet.nama}
            </h2>

            <p className="text-slate-500">
              {outlet.alamat}
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">

          <div>
            <p className="text-slate-500">
              Telepon
            </p>
            <p className="font-semibold">
              {outlet.telepon}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Status
            </p>

            <span
              className="
              bg-green-100
              text-green-700
              px-3 py-1
              rounded-full
              text-sm
              "
            >
              {outlet.status}
            </span>

          </div>

        </div>

      </div>

      {/* Statistik */}

      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <Users
            className="text-blue-500 mb-2"
          />

          <p className="text-slate-500">
            Karyawan
          </p>

          <h2 className="text-3xl font-bold">
            {outlet.totalKaryawan}
          </h2>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <Wallet
            className="text-green-500 mb-2"
          />

          <p className="text-slate-500">
            Investor
          </p>

          <h2 className="text-3xl font-bold">
            {outlet.totalInvestor}
          </h2>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <Receipt
            className="text-orange-500 mb-2"
          />

          <p className="text-slate-500">
            Transaksi
          </p>

          <h2 className="text-3xl font-bold">
            {outlet.totalTransaksi}
          </h2>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md">

          <Wallet
            className="text-emerald-500 mb-2"
          />

          <p className="text-slate-500">
            Pendapatan
          </p>

          <h2 className="text-xl font-bold">
            Rp {outlet.pendapatan.toLocaleString("id-ID")}
          </h2>

        </div>

      </div>

      {/* Karyawan */}

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">
          Daftar Karyawan
        </h2>

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-3 text-left">
                Nama
              </th>

              <th className="p-3 text-left">
                Jabatan
              </th>
            </tr>

          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-3">
                Budi
              </td>

              <td className="p-3">
                Manager
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-3">
                Andi
              </td>

              <td className="p-3">
                Staff Laundry
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

}