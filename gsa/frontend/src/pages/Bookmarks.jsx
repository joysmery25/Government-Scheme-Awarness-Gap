import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import SchemeCard from '../components/SchemeCard';
import { BookmarkMinus } from 'lucide-react';

export default function Bookmarks() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    if (!user) return <Navigate to="/login" />;

    const fetchData = async () => {
        try {
            const res = await api.get('/bookmarks');
            setBookmarks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUnbookmark = async (schemeId) => {
        try {
            await api.delete(`/bookmarks/${schemeId}`);
            fetchData(); // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    // Filter valid populated schemes
    const savedSchemes = bookmarks
        .map(b => b.schemeId)
        .filter(Boolean);

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-textMain">My Bookmarks</h1>
                <p className="text-textMain/70">Schemes you have saved for later</p>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : savedSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedSchemes.map(scheme => (
                        <div key={scheme._id} className="relative group">
                            <SchemeCard scheme={scheme} onBookmark={() => { }} />
                            <button
                                onClick={() => handleUnbookmark(scheme._id)}
                                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Remove Bookmark"
                            >
                                <BookmarkMinus className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-borders">
                    <BookmarkMinus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-500">No bookmarks yet</h3>
                    <p className="text-gray-400 mt-2">Explore schemes and click the bookmark icon to save them here.</p>
                </div>
            )}
        </div>
    );
}
