import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { Save, RefreshCw } from 'lucide-react';

export default function UserProfile() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (user) {
            api.get('/auth/profile').then(res => {
                if (res.data && res.data.profile) {
                    setProfile(res.data.profile);
                }
            }).catch(console.error);
        }
    }, [user]);

    if (!user) return <Navigate to="/login" />;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? value : '') : value
        }));
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        let cats = profile.categories || [];
        if (checked) {
            cats.push(value);
        } else {
            cats = cats.filter(c => c !== value);
        }
        setProfile(prev => ({ ...prev, categories: cats }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/auth/profile', { profile });
            setToast('Profile updated successfully!');
            setTimeout(() => setToast(''), 3000);
        } catch (err) {
            setToast('Failed to update profile');
            setTimeout(() => setToast(''), 3000);
        }
        setLoading(false);
    };

    const categoriesList = [
        'Student', 'Farmer', 'Women', 'Construction Worker', 'Government Employee',
        'Private Employee', 'Business', 'Unemployed', 'Senior Citizen', 'Disabled', 'Widow'
    ];

    return (
        <div className="fade-in max-w-4xl mx-auto pb-12 relative">
            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 slide-up flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${toast.includes('success') ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    {toast}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textMain">My Profile</h1>
                <p className="text-textMain/70 mt-1">Keep your profile updated for better scheme recommendations.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-xl border border-borders shadow-sm p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Name *</label>
                            <input type="text" name="name" value={profile.name || user.fullName} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Age *</label>
                            <input type="number" name="age" value={profile.age || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Gender *</label>
                            <select name="gender" value={profile.gender || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Occupation *</label>
                            <input type="text" name="occupation" value={profile.occupation || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">State *</label>
                            <input type="text" name="state" value={profile.state || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">District *</label>
                            <input type="text" name="district" value={profile.district || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Annual Income *</label>
                            <input type="number" name="income" value={profile.income || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Category *</label>
                            <select name="category" value={profile.category || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary">
                                <option value="">Select Category</option>
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Education *</label>
                            <select name="education" value={profile.education || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary">
                                <option value="">Select Education</option>
                                <option value="None">None</option>
                                <option value="Primary">Primary</option>
                                <option value="High School">High School</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Post Graduate">Post Graduate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Phone Number *</label>
                            <input type="text" name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleChange} required className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Aadhar Number (Optional)</label>
                            <input type="text" name="aadharNumber" value={profile.aadharNumber || ''} onChange={handleChange} className="w-full p-2 border border-borders rounded-lg outline-none focus:border-primary" />
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <h3 className="font-bold border-b pb-2 mb-4">Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {categoriesList.map(cat => {
                                const checked = profile.categories?.includes(cat) || false;
                                return (
                                    <label key={cat} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${checked ? 'bg-primary/5 border-primary text-primary' : 'border-borders'}`}>
                                        <input type="checkbox" value={cat} checked={checked} onChange={handleCategoryChange} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                                        <span className="font-medium text-sm">{cat}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 font-bold disabled:opacity-50">
                        <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Details'}
                    </button>
                </div>
            </form>
        </div>
    );
}
