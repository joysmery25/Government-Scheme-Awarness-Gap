import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
    ArrowLeft, Building, ExternalLink, CheckCircle2,
    Bookmark, Printer, Phone, Mail, Globe, FileText,
    Tag, Users, IndianRupee, Clock, HelpCircle, MapPin, Activity
} from 'lucide-react';

function InfoRow({ icon: Icon, label, value, highlight }) {
    if (!value) return null;
    return (
        <div className={`flex gap-3 p-3 rounded-lg ${highlight ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-borders'}`}>
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlight ? 'text-green-600' : 'text-secondary'}`} />
            <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-textMain font-medium mt-0.5 block">{value}</span>
            </div>
        </div>
    );
}

/** Ensure a URL has a protocol so the browser treats it as absolute */
function ensureHttps(url) {
    if (!url) return null;
    const trimmed = String(url).trim();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/\s+/g, '');
    const withScheme = normalized.match(/^https?:\/\//i)
        ? normalized
        : `https://${normalized.replace(/^\/+/, '')}`;

    try {
        return new URL(withScheme).toString();
    } catch (err) {
        return null;
    }
}

export default function SchemeDetails() {
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        api.get(`/schemes/${id}`).then(res => {
            setScheme(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    const handlePrint = () => window.print();

    const handleBookmark = async () => {
        const userString = localStorage.getItem('user');
        if (!userString) return alert('Please login to bookmark schemes.');
        try {
            await api.post('/bookmarks', { schemeId: scheme._id || scheme.id });
            setBookmarked(true);
            alert('Scheme bookmarked successfully!');
        } catch (error) {
            alert(error.response?.data?.error || 'Error bookmarking scheme');
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-4 p-8">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-12 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-40 bg-gray-200 rounded w-full"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-gray-200 rounded"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!scheme) {
        return (
            <div className="text-center py-20 fade-in">
                <h2 className="text-2xl font-bold text-red-500">Scheme not found</h2>
                <Link to="/schemes" className="text-primary mt-4 inline-block underline">Return to all schemes</Link>
            </div>
        );
    }

    const isCentral = (scheme.schemeType || '').includes('Central');
    const officialUrl = ensureHttps(scheme.officialWebsite);
    const statusUrl = ensureHttps(scheme.statusTrackingWebsite);

    return (
        <div className="fade-in max-w-4xl mx-auto pb-16">
            <Link to="/schemes" className="inline-flex items-center text-textMain/60 hover:text-primary mb-6 transition-colors gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to All Schemes
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-borders overflow-hidden">

                {/* Header */}
                <div className={`p-8 ${isCentral ? 'bg-gradient-to-br from-primary/5 to-primary/10' : 'bg-gradient-to-br from-accent/5 to-accent/10'} border-b border-borders`}>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isCentral ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                            {isCentral ? '🏛 Central Government' : '🏠 State Government (AP)'}
                        </span>
                        {scheme.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-borders text-gray-600">
                                {scheme.category}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-textMain mb-3">{scheme.schemeName}</h1>
                    {scheme.department && (
                        <p className="flex items-center gap-2 text-sm text-textMain/60 mb-4">
                            <Building className="w-4 h-4" /> {scheme.department}
                        </p>
                    )}
                    <p className="text-base text-textMain/80 leading-relaxed">{scheme.description}</p>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left: Details */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Benefits */}
                        {scheme.benefits && (
                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-700">
                                    <IndianRupee className="w-5 h-5" /> Benefits
                                </h3>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-900 font-medium leading-relaxed">
                                    {scheme.benefits}
                                </div>
                            </section>
                        )}

                        {/* Eligibility */}
                        <section>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-accent" /> Eligibility Criteria
                            </h3>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-textMain/85 leading-relaxed mb-3">
                                {scheme.eligibility}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoRow icon={Clock} label="Age Criteria" value={scheme.ageCriteria} />
                                <InfoRow icon={IndianRupee} label="Income Criteria" value={scheme.incomeCriteria} />
                                <InfoRow icon={Tag} label="Category / Target Group" value={scheme.category} />
                            </div>
                        </section>

                        {/* Required Documents */}
                        {scheme.requiredDocuments && (
                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-500" /> Required Documents
                                </h3>
                                <ul className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
                                    {scheme.requiredDocuments.split(',').map((doc, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-textMain/85">
                                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                            {doc.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Application Process */}
                        {scheme.applicationProcess && (
                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-purple-500" /> How to Apply
                                </h3>
                                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-textMain/85 leading-relaxed">
                                    {scheme.applicationProcess}
                                </div>
                                {scheme.officeToVisit && (
                                    <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block">Office to Visit</span>
                                            <span className="text-sm text-textMain/85">{scheme.officeToVisit}</span>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* FAQ */}
                        {scheme.frequentlyAskedQuestions && (
                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-gray-500" /> Frequently Asked Questions
                                </h3>
                                <div className="bg-gray-50 border border-borders rounded-xl p-4 space-y-3">
                                    {scheme.frequentlyAskedQuestions.split(/Q\:/).filter(Boolean).map((faq, idx) => {
                                        const parts = faq.split(/A\:/);
                                        return (
                                            <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                                {parts[0] && <p className="font-semibold text-sm text-textMain">Q: {parts[0].replace(/\?.*/, '?').trim()}</p>}
                                                {parts[1] && <p className="text-textMain/70 text-sm mt-1">A: {parts[1].trim()}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right: Actions + Contact */}
                    <div className="space-y-6">

                        {/* Quick Actions */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-borders sticky top-4">
                            <h4 className="font-bold mb-4 border-b pb-2 text-textMain">Quick Actions</h4>
                            <div className="space-y-3">
                                {officialUrl && (
                                    <a
                                        href={officialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                                    >
                                        <Globe className="w-4 h-4" /> Official Website
                                    </a>
                                )}
                                {statusUrl && statusUrl !== officialUrl && (
                                    <a
                                        href={statusUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary py-2.5 rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm"
                                    >
                                        <Activity className="w-4 h-4" /> Check Application Status
                                    </a>
                                )}
                                <button
                                    onClick={handleBookmark}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors font-medium text-sm border ${bookmarked ? 'bg-accent/10 text-accent border-accent/20' : 'border-borders bg-white text-textMain hover:bg-gray-100'}`}
                                >
                                    <Bookmark className="w-4 h-4" />
                                    {bookmarked ? 'Bookmarked ✓' : 'Save Bookmark'}
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="w-full flex items-center justify-center gap-2 border border-borders bg-white text-textMain py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                                >
                                    <Printer className="w-4 h-4" /> Print Details
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl p-6 border border-borders shadow-sm">
                            <h4 className="font-bold mb-4 text-textMain">Contact Information</h4>
                            <div className="space-y-3">
                                {scheme.contactNumber && (
                                    <a href={`tel:${scheme.contactNumber}`} className="flex items-center gap-3 text-sm hover:text-primary group">
                                        <Phone className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                        <span className="text-textMain/80">{scheme.contactNumber}</span>
                                    </a>
                                )}
                                {scheme.email && (
                                    <a href={`mailto:${scheme.email}`} className="flex items-center gap-3 text-sm hover:text-primary group">
                                        <Mail className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                        <span className="text-textMain/80 break-all">{scheme.email}</span>
                                    </a>
                                )}
                                {officialUrl && (
                                    <a href={officialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-primary group">
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                        <span className="text-textMain/80 break-all">{scheme.officialWebsite}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Scheme Type Badge */}
                        <div className={`rounded-xl p-4 border text-center ${isCentral ? 'border-primary/20 bg-primary/5' : 'border-accent/20 bg-accent/5'}`}>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Scheme Type</p>
                            <p className={`font-bold text-sm ${isCentral ? 'text-primary' : 'text-accent'}`}>{scheme.schemeType}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
