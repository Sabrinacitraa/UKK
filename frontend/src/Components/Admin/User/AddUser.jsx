import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddUser = () => {
  const [addUser, setAddUser] = useState({
    nama_user: '',
    role: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    console.log("handleClick called", addUser);
    setLoading(true);

    const token = sessionStorage.getItem("Token"); // Ambil token dari sessionStorage

    try {
        const response = await axios.post("http://localhost:3000/user", addUser, {
            headers: {
                Authorization: `Bearer ${token}`, // Kirim token dalam header
            },
        });
        const data = response.data;
        console.log(data);

        if (data) {
            toast.success("User berhasil ditambahkan!");
            setAddUser({ nama_user: '', role: '', username: '', password: '' });
        } else {
            throw new Error("Data tidak ditemukan dari server");
        }
    } catch (error) {
        console.error("Add user error:", error);
        toast.error("Terjadi kesalahan saat menambah user. Silakan coba lagi.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="mt-8 mx-16">
      <div className="bg-gray-600 w-full relative overflow-x-auto shadow-md sm:rounded-lg">
        <form onSubmit={handleClick}>
          <div className="grid gap-6 mb-6 md:grid-cols-2 mt-8 mx-8">
            <div>
              <label htmlFor="nama" className="block mb-2 text-sm font-medium text-white">Nama</label>
              <input
                type="text"
                id="nama"
                className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                name="nama_user"
                onChange={handleChange}
                value={addUser.nama_user}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-white">Role</label>
              <select
                id="role"
                className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                name="role"
                onChange={handleChange}
                value={addUser.role}
                required
              >
                <option value="">Role</option>
                <option value="kasir">Kasir</option>
                <option value="admin">Admin</option>
                <option value="manajer">Manager</option>
              </select>
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
              <input
                type="text"
                id="username"
                className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                name="username"
                onChange={handleChange}
                value={addUser.username}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                name="password"
                onChange={handleChange}
                value={addUser.password}
                autoComplete="off"
                required
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              className="ml-8 mr-2 mb-6 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
              onClick={() => setAddUser({ nama_user: '', role: '', username: '', password: '' })}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`mb-6 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser; 