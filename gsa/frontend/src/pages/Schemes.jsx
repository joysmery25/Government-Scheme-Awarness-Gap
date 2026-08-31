import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SchemeCard from '../components/SchemeCard';
import { Search, Filter } from 'lucide-react';

export default function Schemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterGov, setFilterGov] = useState('All');

    const categoriesList = [
        'Farmers', 'Health', 'Housing', 'Women', 'Students & Youth',
        'Insurance', 'Senior Citizens', 'Artisans & Craftspeople',
        'Entrepreneurs & Business', 'Street Vendors', 'Education', 'Women & SHGs'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schemesRes = await api.get('/schemes');
                setSchemes(schemesRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || 'Could not load schemes. Please try again later.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredSchemes = schemes.filter(s => {
        const matchesSearch =
            s.schemeName?.toLowerCase().includes(search.toLowerCase()) ||
            s.description?.toLowerCase().includes(search.toLowerCase()) ||
            s.department?.toLowerCase().includes(search.toLowerCase()) ||
            s.category?.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filterCategory === 'All' || (s.category || '').includes(filterCategory);
        const matchesGov = filterGov === 'All' || (s.schemeType || '').includes(filterGov);
        return matchesSearch && matchesCat && matchesGov;
    });

    const centralSchemes = filteredSchemes.filter(s => (s.schemeType || '').includes('Central'));
    const stateSchemes = filteredSchemes.filter(s => (s.schemeType || '').includes('State'));

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textMain mb-2">All Government Schemes</h1>
                <p className="text-textMain/70">Browse all applicable Central and Andhra Pradesh State government schemes. Click any card to view full details.</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-xl border border-borders shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium mb-1">Search Keyword</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="E.g., Farmer, PM KISAN, Housing..."
                            className="w-full pl-10 pr-4 py-2 border border-borders rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-52">
                    <label className="block text-sm font-medium mb-1">Government Type</label>
                    <select
                        className="w-full p-2 border border-borders rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                        value={filterGov}
                        onChange={(e) => setFilterGov(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Central">Central Government</option>
                        <option value="State">State Government (AP)</option>
                    </select>
                </div>

                <div className="w-full md:w-52">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        className="w-full p-2 border border-borders rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categoriesList.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {(search || filterCategory !== 'All' || filterGov !== 'All') && (
                    <button
                        onClick={() => { setSearch(''); setFilterCategory('All'); setFilterGov('All'); }}
                        className="px-4 py-2 border border-borders rounded-lg bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Summary badges */}
            {!loading && (
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        🏛 Central: {centralSchemes.length} schemes
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                        🏠 State (AP): {stateSchemes.length} schemes
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                        📋 Total: {filteredSchemes.length} shown
                    </span>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse bg-white p-6 rounded-xl border border-borders h-64">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-8 text-center">
                    <p className="font-semibold text-lg">Unable to load schemes</p>
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                </div>
            ) : filteredSchemes.length > 0 ? (
                <div className="space-y-12">
                    {centralSchemes.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary pb-3 text-primary flex items-center gap-2">
                                🏛 Central Government Schemes
                                <span className="text-base font-normal bg-primary/10 px-2 py-0.5 rounded-full">{centralSchemes.length}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {centralSchemes.map(scheme => (
                                    <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
                                ))}
                            </div>
                        </div>
                    )}
                    {stateSchemes.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b-2 border-accent pb-3 text-accent flex items-center gap-2">
                                🏠 Andhra Pradesh State Government Schemes
                                <span className="text-base font-normal bg-accent/10 px-2 py-0.5 rounded-full">{stateSchemes.length}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stateSchemes.map(scheme => (
                                    <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-borders">
                    <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-500">No schemes found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
