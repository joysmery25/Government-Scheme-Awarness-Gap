import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, Lock, ExternalLink } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


export default function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Use environment variable if available, else null
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1028080061986-9i3732sbsptv5p02vpt3fve5ffeqftf3.apps.googleusercontent.com";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Send raw credential to backend for server-side verification
            const res = await api.post('/auth/google', { credential: credentialResponse.credential });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Google login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] fade-in">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-borders w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-primary">Citizen Login</h2>
                    <p className="text-textMain/70 mt-2">Access your personalized dashboard</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center border border-red-200">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm text-textMain">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded text-primary focus:ring-primary"
                            />
                            <span>Remember Me</span>
                        </label>
                        <button type="button" onClick={() => alert('Forgot password working')} className="text-sm text-primary hover:underline font-semibold">Forgot Password?</button>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-md">
                        Sign In
                    </button>

                    <div className="mt-4 flex flex-col items-center justify-center">
                        <div className="mb-4 text-sm text-gray-500 font-semibold uppercase">Or</div>
                        {GOOGLE_CLIENT_ID ? (
                            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google OAuth Login failed.')}
                                    theme="filled_blue"
                                    size="large"
                                    width="100%"
                                />
                            </GoogleOAuthProvider>
                        ) : (
                            <div className="text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg py-3 px-4 w-full">
                                Google Sign-in not configured.<br />
                                <span className="font-medium">Add VITE_GOOGLE_CLIENT_ID to your frontend .env</span>
                            </div>
                        )}
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-textMain/70">
                    Admin staff? <Link to="/admin-login" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">Go to Admin Portal <ExternalLink className="w-3 h-3" /></Link>
                </div>
                <div className="mt-2 text-center text-sm text-textMain/70">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">Register Here <ExternalLink className="w-3 h-3" /></Link>
                </div>
            </div>
        </div>
    );
}
