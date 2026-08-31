import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SchemeCard from '../components/SchemeCard';
import { Search, User, AlertCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES_LIST = [
    'Student', 'Farmer', 'Women', 'Construction Worker', 'Government Employee',
    'Private Employee', 'Business', 'Unemployed', 'Senior Citizen', 'Disabled', 'Widow'
];

const STATES_LIST = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function EligibilityChecker() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        occupation: '',
        income: '',
        state: '',
        district: '',
        education: '',
        categories: []
    });

    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isLoggedIn = !!localStorage.getItem('user');

    // Pre-fill from saved profile if logged in
    useEffect(() => {
        if (isLoggedIn) {
            api.get('/auth/profile').then(res => {
                if (res.data && res.data.profile) {
                    const p = res.data.profile;
                    setFormData(prev => ({
                        ...prev,
                        age: p.age || '',
                        gender: p.gender || '',
                        occupation: p.occupation || '',
                        income: p.income || '',
                        state: p.state || '',
                        district: p.district || '',
                        education: p.education || '',
                        categories: p.categories || []
                    }));
                }
            }).catch(() => { /* not logged in or no profile – that's fine */ });
        }
    }, [isLoggedIn]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (cat) => {
        setFormData(prev => {
            const cats = prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat];
            return { ...prev, categories: cats };
        });
    };

    const checkEligibility = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        setHasSearched(true);

        const payload = {};
        if (formData.age) payload.age = Number(formData.age);
        if (formData.gender) payload.gender = formData.gender;
        if (formData.occupation?.trim()) payload.occupation = formData.occupation.trim();
        if (formData.income) payload.income = Number(formData.income);
        if (formData.state) payload.state = formData.state;
        if (formData.district?.trim()) payload.district = formData.district.trim();
        if (formData.education) payload.education = formData.education;
        if (formData.categories.length > 0) payload.categories = formData.categories;

        if (Object.keys(payload).length === 0) {
            setErrorMsg('Please enter at least one detail to search eligible schemes.');
            setLoading(false);
            setResults([]);
            return;
        }

        try {
            const res = await api.post('/eligibility/check', payload);
            setResults(res.data);
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.error || 'Failed to check eligibility. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const centralSchemes = results.filter(s =>
        (s.government === 'Central') || (s.schemeType || '').toLowerCase().includes('central')
    );
    const stateSchemes = results.filter(s =>
        (s.government === 'Andhra Pradesh') || (s.schemeType || '').toLowerCase().includes('state') || (s.schemeType || '').toLowerCase().includes('andhra')
    );

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-textMain mb-2">Eligibility Checker</h1>
                <p className="text-textMain/70">Enter your details and click <strong>Find Eligible Schemes</strong> to see all schemes you qualify for.</p>
                {!isLoggedIn && (
                    <p className="mt-2 text-sm text-blue-600 bg-blue-50 inline-block px-4 py-1.5 rounded-full border border-blue-200">
                        💡 <button onClick={() => navigate('/login')} className="underline font-medium">Login</button> to auto-fill your profile details.
                    </p>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* ── Left: Form ── */}
                <form
                    onSubmit={checkEligibility}
                    className="bg-white p-6 rounded-xl shadow-sm border border-borders w-full lg:w-[340px] space-y-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto"
                >
                    <h3 className="font-bold text-xl border-b pb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Your Profile
                    </h3>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Age</label>
                        <input
                            type="number" name="age" min={0} max={120}
                            value={formData.age} onChange={handleChange}
                            placeholder="e.g. 28"
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Gender</label>
                        <select
                            name="gender" value={formData.gender} onChange={handleChange}
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Annual Income */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Annual Income (₹)</label>
                        <input
                            type="number" name="income" min={0}
                            value={formData.income} onChange={handleChange}
                            placeholder="e.g. 250000"
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Occupation</label>
                        <input
                            type="text" name="occupation"
                            value={formData.occupation} onChange={handleChange}
                            placeholder="e.g. Farmer, Student…"
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">State</label>
                        <select
                            name="state" value={formData.state} onChange={handleChange}
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                        >
                            <option value="">Select State</option>
                            {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Education</label>
                        <select
                            name="education" value={formData.education} onChange={handleChange}
                            className="w-full p-2.5 border border-borders rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                        >
                            <option value="">Select Education</option>
                            <option value="Below 10th">Below 10th</option>
                            <option value="10th Pass">10th Pass</option>
                            <option value="12th Pass">12th Pass</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>

                    {/* Special Categories */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Special Categories <span className="text-xs font-normal text-gray-400">(select all that apply)</span></label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES_LIST.map(cat => {
                                const checked = formData.categories.includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${checked
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-gray-600 border-borders hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90 hover:shadow-lg'}`}
                    >
                        <Search className="w-5 h-5" />
                        {loading ? 'Searching…' : 'Find Eligible Schemes'}
                    </button>
                </form>

                {/* ── Right: Results ── */}
                <div className="w-full flex-1">
                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    {hasSearched ? (
                        <div className="slide-up">
                            {/* Summary banner */}
                            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${results.length > 0
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-base">
                                        {results.length > 0
                                            ? `${results.length} Eligible Scheme${results.length > 1 ? 's' : ''} Found!`
                                            : 'No matching schemes found'}
                                    </p>
                                    <p className="text-sm mt-0.5">
                                        {results.length > 0
                                            ? `${centralSchemes.length} Central + ${stateSchemes.length} Andhra Pradesh State schemes.`
                                            : 'Try adjusting your filters or selecting fewer categories.'}
                                    </p>
                                </div>
                            </div>

                            {/* Profile summary */}
                            {results.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
                                    <p className="font-bold mb-1.5">Your search criteria:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.age && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">Age: {formData.age}</span>}
                                        {formData.gender && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">Gender: {formData.gender}</span>}
                                        {formData.income && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">Income: ₹{Number(formData.income).toLocaleString('en-IN')}</span>}
                                        {formData.occupation && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">Occupation: {formData.occupation}</span>}
                                        {formData.state && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">State: {formData.state}</span>}
                                        {formData.education && <span className="bg-white border border-blue-200 rounded-full px-2.5 py-0.5">Education: {formData.education}</span>}
                                        {formData.categories.map(c => (
                                            <span key={c} className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-10">
                                {centralSchemes.length > 0 && (
                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary pb-2 flex items-center gap-2">
                                            🏛 Central Government Schemes
                                            <span className="text-sm font-normal bg-primary/10 px-2.5 py-0.5 rounded-full">{centralSchemes.length}</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {centralSchemes.map(scheme => (
                                                <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {stateSchemes.length > 0 && (
                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-accent border-b-2 border-accent pb-2 flex items-center gap-2">
                                            🏠 Andhra Pradesh State Schemes
                                            <span className="text-sm font-normal bg-accent/10 px-2.5 py-0.5 rounded-full">{stateSchemes.length}</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {stateSchemes.map(scheme => (
                                                <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {results.length > 0 && centralSchemes.length === 0 && stateSchemes.length === 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {results.map(scheme => (
                                            <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-xl p-16 text-center flex flex-col items-center justify-center h-full min-h-[420px]">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                                <Search className="w-10 h-10 text-primary/50" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-500 mb-2">Awaiting Your Details</h3>
                            <p className="text-gray-400 max-w-sm">
                                Fill out the form on the left and click <strong className="text-primary">Find Eligible Schemes</strong> to see personalized results from our eligibility engine.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
