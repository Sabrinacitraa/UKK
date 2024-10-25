import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DataTransaksi() {
    const [transaksi, setTransaksi] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredTransaksi, setFilteredTransaksi] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch transaksi data
    const fetchTransaksi = async () => {
        const token = sessionStorage.getItem('Token');
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/transaksi', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            console.log(data);
            setTransaksi(data.transaksi || []);
            setFilteredTransaksi(data.transaksi || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transaksi:', error);
            toast.error("Failed to fetch transaksi.");
            setError("Failed to fetch transaksi.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaksi();
    }, []);

    // Helper function to format the date
    const dateFormat = (date) => {
        if (!date) return 'N/A'; // Handle invalid date
        const dateObj = new Date(date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return dateObj.toLocaleDateString('id-ID', options);
    };

    // Filter transactions based on selected date
    const filterByDate = (date) => {
        if (date) {
            const filteredData = transaksi.filter((t) => {
                const tgl_transaksi = new Date(t.tgl_transaksi);
                return tgl_transaksi.toDateString() === date.toDateString();
            });
            setFilteredTransaksi(filteredData);
        } else {
            setFilteredTransaksi(transaksi); // Reset to all transactions if no date is selected
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="mt-5 mx-5 flex">
                <div className="flex p-2 bg-gray-200 rounded-md border shadow-sm">
                    <span className="flex-none">Tgl. Transaksi: </span>
                    <DatePicker
                        className="pl-1 bg-gray-200"
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            filterByDate(date);
                        }}
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="text-xs text-black bg-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-gray-900">Nama Kasir</th>
                            <th scope="col" className="px-6 py-4 text-gray-900">Tanggal Transaksi</th>
                            <th scope="col" className="px-6 py-4 text-gray-900">Total Harga</th>
                            <th scope="col" className="px-6 py-4 text-gray-900">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                        {filteredTransaksi.length > 0 ? (
                            filteredTransaksi.map((transaksi) => (
                                <tr key={transaksi.id_transaksi} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{transaksi.user?.nama_user || 'N/A'}</td>
                                    <td className="px-6 py-4">{dateFormat(transaksi.tgl_transaksi) || 'N/A'}</td>
                                    <td className="px-6 py-4">{transaksi.total || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                                {transaksi.status || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            selectedDate && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data pengunjung di tanggal ini
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
