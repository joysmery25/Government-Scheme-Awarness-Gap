import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Bookmark, Search, Clock } from 'lucide-react';
import api from '../utils/api';
import SchemeCard from '../components/SchemeCard';

export default function UserDashboard() {
    const userString = localStorage.getItem('user');
    const [user, setUser] = useState(userString ? JSON.parse(userString) : null);
    const [profile, setProfile] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [schemes, setSchemes] = useState([]);

    useEffect(() => {
        if (user) {
            api.get('/bookmarks').then(res => setBookmarks(res.data)).catch(console.error);
            api.get('/schemes').then(res => setSchemes(res.data)).catch(console.error);
            api.get('/auth/profile').then(res => {
                if (res.data) setProfile(res.data.profile || res.data);
            }).catch(console.error);
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Generate some recommendations heuristically
    const recommended = schemes.filter(s => {
        if (!profile || !profile.categories) return false;
        const schemeCats = s.eligibility?.category || [];
        return schemeCats.some(cat => profile.categories.includes(cat));
    }).slice(0, 3); // Get top 3

    return (
        <div className="fade-in max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textMain">Welcome back, {user.fullName}</h1>
                <p className="text-textMain/70 mt-1">Here is a summary of your portal activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-borders shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Saved Schemes</p>
                        <p className="text-3xl font-bold text-textMain">{bookmarks.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                        <Bookmark className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-borders shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Profile Status</p>
                        <p className="text-lg font-bold text-accent">{profile?.age ? 'Complete' : 'Incomplete'}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-accent rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                </div>
                <Link to="/eligibility" className="bg-white p-6 rounded-xl border border-borders shadow-sm flex items-center justify-between hover:border-primary transition-colors cursor-pointer md:col-span-2 group">
                    <div>
                        <p className="text-lg font-bold text-textMain group-hover:text-primary transition-colors mb-1">Check Eligibility Now</p>
                        <p className="text-sm text-gray-500">Discover new schemes based on your profile</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-colors">
                        <Search className="w-6 h-6" />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Recommended for You</h2>
                    {recommended.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50/50">
                            {recommended.map(s => <SchemeCard key={s._id} scheme={s} />)}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-borders shadow-sm text-center">
                            <p className="text-gray-500">Complete your profile to get personalized recommendations.</p>
                            <Link to="/profile" className="text-primary mt-2 inline-block font-medium">Go to Profile →</Link>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold border-b pb-2 mb-6">Recent Activity</h2>
                    <div className="bg-white rounded-xl border border-borders shadow-sm p-4 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-2 rounded-lg text-primary mt-1"><Clock className="w-4 h-4" /></div>
                            <div>
                                <p className="font-semibold text-sm">Logged in</p>
                                <p className="text-xs text-gray-400">Recently</p>
                            </div>
                        </div>
                        {bookmarks.slice(0, 3).map(b => (
                            <div key={b._id} className="flex items-start gap-4">
                                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600 mt-1"><Bookmark className="w-4 h-4" /></div>
                                <div>
                                    <p className="font-semibold text-sm">Bookmarked {b.schemeId?.schemeName || 'a scheme'}</p>
                                    <p className="text-xs text-gray-400">Recently</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
