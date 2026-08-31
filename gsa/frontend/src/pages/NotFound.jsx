import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
            <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-textMain mb-4">Page Not Found</h2>
            <p className="text-textMain/70 mb-8 max-w-md text-center">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Back to Home
            </Link>
        </div>
    );
}
