import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, ArrowRight, Building, Tag, IndianRupee } from 'lucide-react';
import api from '../utils/api';

export default function SchemeCard({ scheme, onBookmark }) {
    const isCentral = (scheme.government === 'Central') || (scheme.schemeType || '').toLowerCase().includes('central');
    const schemeId = scheme._id || scheme.id;

    const handleBookmark = async () => {
        const userString = localStorage.getItem('user');
        if (!userString) return alert('Please login to bookmark schemes.');
        try {
            await api.post('/bookmarks', { schemeId });
            if (onBookmark) onBookmark(schemeId);
            alert('Scheme bookmarked successfully!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Error bookmarking scheme');
        }
    };

    const handleShare = () => {
        const url = window.location.origin + `/schemes/${schemeId}`;
        if (navigator.share) {
            navigator.share({
                title: scheme.schemeName,
                text: `Check out this government scheme: ${scheme.schemeName}`,
                url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-borders overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 flex flex-col h-full slide-up">
            <div className="p-5 flex-grow">
                {/* Type Badge + Category */}
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isCentral ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                        {isCentral ? '🏛 Central' : '🏠 State (AP)'}
                    </span>
                    {scheme.category && (
                        <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium truncate max-w-[130px] flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {scheme.category}
                        </span>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-textMain mb-2 line-clamp-2 leading-snug" title={scheme.schemeName}>
                    {scheme.schemeName}
                </h3>

                {/* Description */}
                <p className="text-sm text-textMain/65 mb-4 line-clamp-3 leading-relaxed">{scheme.description}</p>

                {/* Key info */}
                <div className="space-y-2">
                    {scheme.benefits && (
                        <div className="flex items-start text-xs bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                            <IndianRupee className="w-3.5 h-3.5 mr-1.5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-green-800 line-clamp-2">{scheme.benefits}</span>
                        </div>
                    )}
                    {scheme.department && (
                        <div className="flex items-start text-xs text-gray-500">
                            <Building className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5 text-gray-400" />
                            <span className="line-clamp-1">{scheme.department}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action footer */}
            <div className="p-4 border-t border-borders bg-gray-50 flex gap-2">
                <Link
                    to={`/schemes/${schemeId}`}
                    className="flex-1 bg-primary text-white text-center py-2 px-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-1"
                >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                    onClick={handleBookmark}
                    className="p-2 border border-borders rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Bookmark"
                >
                    <Bookmark className="w-4 h-4" />
                </button>
                <button
                    onClick={handleShare}
                    className="p-2 border border-borders rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Share"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
