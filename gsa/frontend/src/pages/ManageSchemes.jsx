import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function ManageSchemes() {
    const adminString = localStorage.getItem('admin');
    const admin = adminString ? JSON.parse(adminString) : null;
    const [schemes, setSchemes] = useState([]);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        schemeName: '', government: 'Central', department: '', description: '', benefits: '',
        eligibility: { minAge: '', maxAge: '', incomeLimit: '', gender: 'All', category: [], occupationCategories: [] },
        requiredDocuments: '', applicationProcess: '', officialWebsite: '', statusTrackingWebsite: '', officeToVisit: '', districtLevelOffice: '', helplineNumber: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState('');

    if (!admin) return <Navigate to="/admin-login" />;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const schRes = await api.get('/schemes');
            setSchemes(schRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scheme?')) {
            try {
                await api.delete(`/schemes/${id}`);
                fetchData();
                showToast('Scheme deleted successfully.');
            } catch (e) {
                showToast('Error deleting scheme.');
            }
        }
    };

    const openForm = (scheme = null) => {
        if (scheme) {
            setFormData({
                ...scheme,
                eligibility: scheme.eligibility || { minAge: '', maxAge: '', incomeLimit: '', gender: 'All', category: [], occupationCategories: [] },
                requiredDocuments: scheme.requiredDocuments?.join(', ') || ''
            });
            setEditId(scheme._id);
            setIsEdit(true);
        } else {
            setFormData({
                schemeName: '', government: 'Central', department: '', description: '', benefits: '',
                eligibility: { minAge: '', maxAge: '', incomeLimit: '', gender: 'All', category: [], occupationCategories: [] },
                requiredDocuments: '', applicationProcess: '', officialWebsite: '', statusTrackingWebsite: '', officeToVisit: '', districtLevelOffice: '', helplineNumber: ''
            });
            setEditId(null);
            setIsEdit(false);
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('eligibility.')) {
            const field = name.split('.')[1];
            if (field === 'category' || field === 'occupationCategories') {
                setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, [field]: value.split(',').map(s => s.trim()) }
                });
            } else {
                setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, [field]: value }
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (typeof payload.requiredDocuments === 'string' && payload.requiredDocuments.length > 0) {
                payload.requiredDocuments = payload.requiredDocuments.split(',').map(s => s.trim());
            } else if (typeof payload.requiredDocuments === 'string') {
                payload.requiredDocuments = [];
            }
            if (isEdit) {
                await api.put(`/schemes/${editId}`, payload);
                showToast('Scheme updated.');
            } else {
                await api.post(`/schemes`, payload);
                showToast('Scheme created.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            showToast('Error saving scheme.');
        }
    };

    const filtered = schemes.filter(s => s.schemeName?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fade-in max-w-7xl mx-auto pb-12 relative">
            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 slide-up">
                    {toast}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain">Manage Schemes</h1>
                    <p className="text-textMain/70">Create, update or delete schemes</p>
                </div>
                <button onClick={() => openForm()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90">
                    <Plus className="w-5 h-5" /> Add Scheme
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-borders overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-sm border-b">
                                <th className="p-4 font-semibold w-1/3">Scheme Name</th>
                                <th className="p-4 font-semibold">Government</th>
                                <th className="p-4 font-semibold">Department</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-textMain">{s.schemeName}</td>
                                    <td className="p-4 text-sm text-gray-600 border-x">
                                        <span className={`px-2 py-1 rounded text-xs ${s.government === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {s.government}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 border-x">{s.department}</td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button onClick={() => openForm(s)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No schemes found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 font-sans fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto slide-up">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">{isEdit ? 'Edit Scheme' : 'Add New Scheme'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Scheme Name *</label>
                                    <input type="text" name="schemeName" value={formData.schemeName} onChange={handleFormChange} required className="w-full p-2 border rounded focus:border-primary outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Government</label>
                                        <select name="government" value={formData.government} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none">
                                            <option>Central</option>
                                            <option>Andhra Pradesh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Department</label>
                                        <input type="text" name="department" value={formData.department} onChange={handleFormChange} required className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Description *</label>
                                    <textarea name="description" value={formData.description} onChange={handleFormChange} required className="w-full p-2 border rounded focus:border-primary outline-none h-24" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Benefits *</label>
                                    <textarea name="benefits" value={formData.benefits} onChange={handleFormChange} required className="w-full p-2 border rounded focus:border-primary outline-none h-24" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold border-b pb-1">Eligibility Criteria</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Min Age</label>
                                        <input type="number" name="eligibility.minAge" value={formData.eligibility.minAge} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Max Age</label>
                                        <input type="number" name="eligibility.maxAge" value={formData.eligibility.maxAge} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Income Limit</label>
                                        <input type="number" name="eligibility.incomeLimit" value={formData.eligibility.incomeLimit} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Gender</label>
                                        <select name="eligibility.gender" value={formData.eligibility.gender} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none">
                                            <option>All</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Categories (comma sep)</label>
                                    <input type="text" name="eligibility.category" value={formData.eligibility.category.join(', ')} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                </div>
                                <h3 className="font-bold border-b mt-4 pb-1">Other Info</h3>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Required Documents (comma sep)</label>
                                    <textarea name="requiredDocuments" value={formData.requiredDocuments} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none h-16" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Official Website</label>
                                        <input type="url" name="officialWebsite" value={formData.officialWebsite} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Helpline</label>
                                        <input type="text" name="helplineNumber" value={formData.helplineNumber} onChange={handleFormChange} className="w-full p-2 border rounded focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4 border-t flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/90">
                                    {isEdit ? 'Update Scheme' : 'Save Scheme'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
