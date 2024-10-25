import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Riwayat() {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
  };

  const [transaksi, setTransaksi] = useState([]);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);
  const [meja, setMeja] = useState([]);
  const [search, setSearch] = useState("");
  const [nota, setNota] = useState(null);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const transaksiResponse = await axios.get("http://localhost:3000/transaksi/", {
          headers,
        });
        setTransaksi(transaksiResponse.data.transaksi);
        setFilteredTransaksi(transaksiResponse.data.transaksi);

        const mejaResponse = await axios.get("http://localhost:3000/meja/", { headers });
        setMeja(mejaResponse.data.meja);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchDatas();
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
    const dataFiltered = transaksi.filter((data) => {
      return data.meja && data.meja.nomor_meja === e.target.value;
    });
    setFilteredTransaksi(dataFiltered);
  };

  const handleBayar = async (id) => {
    const selectedTransaksi = transaksi.find((select) => select.id_transaksi === id);
    const selectedMeja = meja.find((select) => select.id === selectedTransaksi.meja.id);

    const updatedStatusTransaksi = {
      status: "lunas",
    };

    const updatedStatusMeja = {
      nomor_meja: selectedMeja.nomor_meja,
      status: "tersedia",
    };

    try {
      await axios.put(`http://localhost:3000/meja/${selectedMeja.id_meja}`, updatedStatusMeja, { headers });
      await axios.put(`http://localhost:3000/transaksi/updatePembayaran/${id}`, updatedStatusTransaksi, { headers });
      
      setNota(selectedTransaksi);

      window.location.reload();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleChange}
        name="search"
        placeholder="Search by nomor meja"
        className="w-32 py-2 pl-10 ml-10 mt-5 text-sm rounded-md sm:w-auto focus:outline-none text-black bg-gray-200"
      />
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Nama Pelanggan</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Nomor Meja</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Total Harga</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">Status</th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredTransaksi.map((transaksi) => (
              <tr key={transaksi.id_transaksi} className="hover:bg-gray-50">
                <td className="px-6 py-4">{transaksi.nama_pelanggan}</td>
                <td className="px-6 py-4">Meja nomor {transaksi.meja?.nomor_meja}</td>
                <td className="px-6 py-4">{transaksi.total}</td>
                <td className="px-6 py-4">
                  {transaksi.status === "belum_bayar" ? (
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">Belum Lunas</span>
                      <button onClick={() => handleBayar(transaksi.id_transaksi)} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-rose-600">Bayar</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">Lunas</span>
                      <button onClick={() => setNota(transaksi)} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-blue-600">See Nota</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nota && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">Jayanti Cofee</h2>
              <p className="text-sm">Jl.Danau Kerinci IV, Sawojajar, Kota Malang</p>
              <p className="text-sm">Telp: (021) 12345678</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-semibold">Nama Pelanggan: {nota.nama_pelanggan}</p>
              <p className="text-sm">Nomor Meja: {nota.meja?.nomor_meja}</p>
              <p className="text-sm">Tanggal: {new Date(nota.tgl_transaksi).toLocaleDateString()}</p>
              <p className="text-sm">Kasir: {nota.user?.nama_user}</p>
            </div>

            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th className="text-left border-b pb-2 text-sm">Pesanan</th>
                  <th className="text-center border-b pb-2 text-sm">Jumlah</th>
                  <th className="text-right border-b pb-2 text-sm">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {nota.detail_transaksi?.map((detail, index) => (
                  <tr key={index}>
                    <td className="text-left py-2 text-sm">{detail.menu?.nama_menu}</td>
                    <td className="text-center py-2 text-sm">{detail.qty}</td>
                    <td className="text-right py-2 text-sm">Rp{detail.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4 text-right">
              <p className="font-semibold text-sm">Total: Rp{nota.total}</p>
            </div>

            <div className="mt-4 text-sm">
              <p>Terima kasih atas kunjungannya!</p>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => setNota(null)} className="bg-red-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
