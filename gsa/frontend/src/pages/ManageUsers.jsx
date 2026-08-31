import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Eye, Trash2, X } from 'lucide-react';

export default function ManageUsers() {
    const adminString = localStorage.getItem('admin');
    const admin = adminString ? JSON.parse(adminString) : null;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [toast, setToast] = useState('');

    if (!admin) return <Navigate to="/admin-login" />;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
                showToast('User deleted successfully.');
            } catch (e) {
                showToast('Error deleting user.');
            }
        }
    };

    const openView = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const filtered = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in max-w-7xl mx-auto pb-12 relative">
            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 slide-up">
                    {toast}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textMain">Manage Users</h1>
                <p className="text-textMain/70">View and manage registered citizens</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-borders overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by email or name..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-textMain text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm border-b">
                                <th className="p-4 font-semibold">User ID</th>
                                <th className="p-4 font-semibold">Full Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-xs font-mono text-gray-500">{u._id.slice(-6)}</td>
                                    <td className="p-4 font-medium text-textMain">{u.fullName}</td>
                                    <td className="p-4 text-sm text-gray-700">{u.email}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {u.profile?.district || u.profile?.state ? (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {u.profile?.district ? `${u.profile.district}, ` : ''}{u.profile?.state}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button onClick={() => openView(u)} className="p-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"><Eye className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(u._id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto slide-up">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">User Details</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Full Name</span>
                                    <span className="font-medium">{selectedUser.fullName}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Email</span>
                                    <span className="font-medium">{selectedUser.email}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Age</span>
                                    <span className="font-medium">{selectedUser.profile?.age || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Gender</span>
                                    <span className="font-medium">{selectedUser.profile?.gender || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Income</span>
                                    <span className="font-medium text-green-600">₹{selectedUser.profile?.income || 0}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Education</span>
                                    <span className="font-medium">{selectedUser.profile?.education || 'Not provided'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-gray-500 font-semibold mb-2">Applied Categories</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.profile?.categories?.map(cat => (
                                            <span key={cat} className="px-2 py-1 bg-gray-100 border text-xs font-semibold rounded">{cat.toUpperCase()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex justify-end">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded hover:bg-gray-200 font-semibold">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
