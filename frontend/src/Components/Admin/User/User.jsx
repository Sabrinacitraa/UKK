import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications

export default function User() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pickId, setPickId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all users
    const fetchUser = async () => {
        const token = sessionStorage.getItem('Token'); // Get token from session storage
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user', {
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
            setUsers(data.user || []); // Use setUsers instead of setUser
            setLoading(false); // Set loading to false after fetching users
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error("Failed to fetch users."); // Use toast for error notification
            setError("Failed to fetch users.");
            setLoading(false); // Set loading to false even on error
        }
    };

    // Effect to fetch users when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    // Function to set the ID of the user to be deleted
    const selectId = (id) => {
        setPickId(id);
        setShowModal(true); // Show modal when a user is selected for deletion
    };

    const handleDelete = (event) => {
        event.preventDefault(); // Prevent default behavior
        deleteId(); // Call your delete function
    };
    
    const deleteId = async () => {
        const token = sessionStorage.getItem('Token');
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            return;
        }
    
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
    
            console.log("Attempting to delete user with ID:", pickId);
            await axios.delete(`http://localhost:3000/user/${pickId}`, { headers });
            console.log("User deleted successfully");
    
            // Fetch updated users or update state accordingly
            fetchUser(); // Refresh user list
            setShowModal(false);
            toast.success("User deleted successfully."); 
        } catch (err) {
            console.error('Error deleting user:', err); 
            setError(err.response ? err.response.data.message : "Error deleting user.");
            toast.error("Error deleting user."); 
        }
    };
    

    return (
        <div>
            <div className="my-8 mx-16">
                <div>
                    <a href="add_user">
                        <button type="button" className="mb-1 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-[#4A6145] hover:bg-[#678161] focus:ring-[#678161]">
                            Tambahkan User
                        </button>
                    </a>
                </div>
                <div className="flex flex-wrap gap-5">
                    <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-black bg-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center">Nama User</th>
                                    <th scope="col" className="px-6 py-3 text-center">Username</th>
                                    <th scope="col" className="px-6 py-3 text-center">Role</th>
                                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-red-500">{error}</td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id_user} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 text-center">{user.nama_user}</td>
                                            <td className="px-6 py-4 text-center">{user.username}</td>
                                            <td className="px-6 py-4 text-center">{user.role}</td>
                                            <td className="pl-6 py-4 text-right">
                                                <a href={`edit_user/${user.id_user}`} className="font-medium text-blue-600 hover:underline">Edit</a>
                                                <button onClick={() => selectId(user.id_user)} className="mx-4 font-medium text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">Tidak ada data pengguna.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="relative rounded-lg shadow bg-gray-700">
                                    <button onClick={() => setShowModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-6 text-center">
                                        <svg aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12c0 4.973-3.134 9.164-7.5 10.2M3 12c0-4.973 3.134-9.164 7.5-10.2"></path>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-white">Apakah Anda yakin ingin menghapus pengguna ini?</h3>
                                        <button onClick={deleteId} type="button" className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Ya, hapus</button>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-500 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Tidak</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
                </div>
            )}
        </div>
    );
}
