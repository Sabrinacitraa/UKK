import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "../../Login";

export default function EditUser() {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    };
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get user ID from pathname
    const url = window.location.pathname;
    const idUser = url.split("/").pop();;

    const [prevData, setPrevData] = useState({
        nama_user: '',
        role: '',
        username: '',
        password: ''
    });
    const [lastUsername, setLastUsername] = useState('');
    const [checkUsername, setCheckUsername] = useState([]);

    useEffect(() => {
        const getUsername = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", { headers });
                const username = response.data.user.map(res => res.username);

                setCheckUsername(username);
            } catch (err) {
                console.error(err);
                toast.error("Gagal mengambil daftar username!");
            }
        };

        const getDataFromId = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/user/${idUser}`, { headers });
                const userData = res.data;
                console.log(userData);

                userData.password = ""; // Clear password field
                setPrevData(userData.user);
                setLastUsername(userData.user.username);
            } catch (err) {
                console.error(err);
                toast.error("Gagal mengambil data user!");
            }
        };

        getDataFromId();
        getUsername();
    }, []);

    const handleChange = (e) => {
        setPrevData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async e => {
        e.preventDefault();

        if (prevData.username !== lastUsername && checkUsername.includes(prevData.username.trim())) {
            toast.info("Username sudah terdaftar");
        } else if (prevData.password === "") {
            toast.error("Password kosong!");
        } else {
            try {
                await axios.put(`http://localhost:3000/user/${idUser}`, prevData, { headers });
                toast.success("Data berhasil diperbarui!");
                navigate("/admin/user");
            } catch (err) {
                console.error(err);
                toast.error("Gagal memperbarui data user!");
            }
        }
    };

    const kembali = () => { 
        navigate("");
    };

    return (
        <div>
            <div className="mt-8 mx-16">
                <div className="bg-gray-600 w-full relative overflow-x-auto shadow-md sm:rounded-lg">
                    <form onSubmit={handleClick}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2 mt-8 mx-8">
                            <div>
                                <label htmlFor="nama" className="block mb-2 text-sm font-medium text-white">Nama</label>
                                <input
                                    required
                                    type="text"
                                    id="nama"
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="nama_user"
                                    value={prevData.nama_user}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-white">Role</label>
                                <select
                                    required
                                    id="role"
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    value={prevData.role || ""}
                                    name="role"
                                    onChange={handleChange}
                                >
                                    <option value="">Role</option>
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                    <option value="manajer">Manajer</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                                <input
                                    required
                                    type="text"
                                    id="username"
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="username"
                                    value={prevData.username || ""}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="password"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div>
                            <button onClick={kembali} className="ml-8 mr-2 mb-6 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800">Batal</button>
                            <button type="submit" className="mb-6 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Simpan</button>
                            <ToastContainer
                                position="top-center"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss={false}
                                draggable={false}
                                pauseOnHover={false}
                                theme="light"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
