import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Meja() {
    const [meja, setMeja] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [addMeja, setAddMeja] = useState({ nomor_meja: '', status: 'tersedia' });
    const [editMeja, setEditMeja] = useState({ id: '', nomor_meja: '', status: '' });
    const [deleteId, setDeleteId] = useState(null);

    const token = sessionStorage.getItem("Token");

    useEffect(() => {
        fetchMeja();
    }, []);

    const fetchMeja = async () => {
        try {
            const response = await fetch('http://localhost:3000/meja', {
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
            setMeja(data.meja || []);
        } catch (error) {
            console.error('Error fetching meja:', error);
            toast.error("Failed to fetch meja.");
        }
    };

    const postMeja = async (e) => {
        e.preventDefault(); 
    
        try {
            const response = await fetch('http://localhost:3000/meja', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(addMeja), 
            });
    
            const result = await response.json(); 
    
            if (!response.ok || result.message !== "Data meja berhasil ditambahkan") {
                
                if (result.message === "Nomor meja sudah ada, tidak bisa ditambahkan") {
                    throw new Error("Nomor meja sudah ada. Silakan gunakan nomor lain.");
                }
                throw new Error(result.message || "Failed to add meja.");
            }
    
            
            fetchMeja(); 
            setShowModalAdd(false); 
            setAddMeja({ nomor_meja: '', status: 'tersedia' }); 
            toast.success("Meja added successfully.");
        } catch (error) {
            console.error('Error adding meja:', error);
            toast.error(error.message || "Failed to add meja."); 
        }
    };
     

    const updateMeja = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/meja/${editMeja.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editMeja),
            });
    
            // Parse response as JSON
            const result = await response.json();
    
            // Cek apakah response tidak ok
            if (!response.ok) {
                throw new Error(result.message || "Failed to update meja.");
            }
    
            // Jika update sukses
            fetchMeja(); 
            setShowModalEdit(false); 
            toast.success(result.message || "Meja updated successfully."); 
        } catch (error) {
            console.error('Error updating meja:', error);
            toast.error(error.message || "Failed to update meja."); 
        }
    };

    
    const selectIdDelete = (id_meja) => {
        setDeleteId(id_meja);
        setShowModalDelete(true);
    };

    const deleteMeja = async () => {
        try {
            const response = await fetch(`http://localhost:3000/meja/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Failed to delete meja.");
            }

            fetchMeja();
            setShowModalDelete(false);
            toast.success("Meja deleted successfully.");
        } catch (error) {
            console.error('Error deleting meja:', error);
            toast.error(error.message || "Failed to delete meja.");
        }
    };

    const handleChange_Add = (e) => {
        setAddMeja({ ...addMeja, [e.target.name]: e.target.value });
    };

    const handleChange_Edit = (e) => {
        setEditMeja({ ...editMeja, [e.target.name]: e.target.value });
    };

    const selectDataEdit = (id_meja, nomor_meja) => {
        setEditMeja({ id: id_meja, nomor_meja, status: 'tersedia' }); // Corrected to set id correctly
        setShowModalEdit(true);
    };

   

    return (
        <div>
            <div className="my-8 mx-16">
                <div>
                    <button onClick={() => setShowModalAdd(true)} type="button" className="mb-1 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-[#4A6145] hover:bg-[#678161] focus:ring-[#678161]">
                        Tambahkan Meja
                    </button>
                </div>
                <div className="flex flex-wrap gap-5">
                    <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-black bg-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center">Nomor Meja</th>
                                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meja.map((meja) => (
                                    <tr key={meja.id_meja} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{meja.nomor_meja}</td>
                                        <td className="pl-6 py-4 text-right">
                                            <button onClick={() => selectDataEdit(meja.id_meja, meja.nomor_meja)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => selectIdDelete(meja.id_meja)} className="mx-4 font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Delete Confirmation */}
            {showModalDelete && (
                <Modal>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus Meja</h3>
                        <p className="mb-5 text-gray-400">Apakah anda yakin ingin menghapus meja ini?</p>
                        <button onClick={deleteMeja} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Delete
                        </button>
                        <button onClick={() => setShowModalDelete(false)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Cancel</button>
                    </div>
                </Modal>
            )}

            {/* Modal for Add Meja */}
            {showModalAdd && (
                <Modal>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Tambah Meja</h3>
                        <form onSubmit={postMeja}>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nomor Meja</label>
                                <input type="text" name="nomor_meja" value={addMeja.nomor_meja} onChange={handleChange_Add} required className="mt-1 border rounded-md w-full p-2" />
                            </div>
                            <button type="submit" className="mt-4 text-white bg-[#4A6145] hover:bg-[#678161] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Tambahkan
                            </button>
                            <button onClick={() => setShowModalAdd(false)} type="button" className="mt-2 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Cancel</button>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Modal for Edit Meja */}
            {showModalEdit && (
                <Modal>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Edit Meja</h3>
                        <form onSubmit={updateMeja}>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nomor Meja</label>
                                <input type="text" name="nomor_meja" value={editMeja.nomor_meja} onChange={handleChange_Edit} required className="mt-1 border rounded-md w-full p-2" />
                            </div>
                            <button type="submit" className="mt-4 text-white bg-[#4A6145] hover:bg-[#678161] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Simpan
                            </button>
                            <button onClick={() => setShowModalEdit(false)} type="button" className="mt-2 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Cancel</button>
                        </form>
                    </div>
                </Modal>
            )}

            <ToastContainer />
        </div>
    );
}

// Placeholder for Modal component
const Modal = ({ children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">{children}</div>
    </div>
);
