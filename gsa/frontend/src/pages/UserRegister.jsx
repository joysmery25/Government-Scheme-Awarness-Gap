import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { User, Lock, Mail, Phone, Shield, UserCheck, ExternalLink } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function UserRegister() {
    const [role, setRole] = useState('User');   // 'User' | 'Admin'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { ...formData, role });
            setSuccess(`${role} account created successfully! Redirecting to login…`);
            setTimeout(() => {
                navigate(role === 'Admin' ? '/admin-login' : '/login');
            }, 1800);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Google OAuth – only available for User accounts
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            if (!credentialResponse?.credential) {
                throw new Error('Google credential is missing.');
            }
            setLoading(true);
            setError('');
            // Send the raw credential so backend can verify server-side
            const res = await api.post('/auth/google', { credential: credentialResponse.credential });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/dashboard';
        } catch (err) {
            // Fallback: decode client-side and send decoded info
            try {
                const decodedInfo = jwtDecode(credentialResponse?.credential || '');
                const { name, email, sub } = decodedInfo;
                const res = await api.post('/auth/google', { fullName: name, email, googleId: sub });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.dispatchEvent(new Event('storage'));
                window.location.href = '/dashboard';
            } catch {
                setError('Google sign-in failed. Please register with email instead.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] fade-in py-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-borders w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-primary">Create Account</h2>
                    <p className="text-textMain/70 mt-2">Join the Government Scheme Portal</p>
                </div>

                {/* Role Toggle */}
                <div className="flex rounded-xl border border-borders overflow-hidden mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('User')}
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all ${role === 'User'
                            ? 'bg-primary text-white'
                            : 'bg-white text-textMain/60 hover:bg-gray-50'
                            }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        Citizen / User
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('Admin')}
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all ${role === 'Admin'
                            ? 'bg-textMain text-white'
                            : 'bg-white text-textMain/60 hover:bg-gray-50'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        Admin / Staff
                    </button>
                </div>

                {/* Role indicator */}
                <div className={`text-xs text-center mb-4 px-3 py-2 rounded-lg font-medium ${role === 'Admin'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                    {role === 'Admin'
                        ? '⚠️ Creating an Admin account — use only for authorized staff.'
                        : '👤 Citizen account — access eligible government schemes.'}
                </div>

                {/* Error / Success */}
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center border border-red-200 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-center border border-green-200 text-sm">{success}</div>}

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-1">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text" name="fullName"
                                value={formData.fullName} onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-1">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="email@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-1">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required minLength={6}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-1">Confirm Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password" name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleChange}
                                placeholder="Re-enter password"
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone only for User */}
                    {role === 'User' && (
                        <div>
                            <label className="block text-sm font-semibold text-textMain mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text" name="phoneNumber"
                                    value={formData.phoneNumber} onChange={handleChange}
                                    placeholder="+91 XXXXXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-3 rounded-lg transition-all shadow-md text-white ${loading ? 'opacity-60 cursor-not-allowed' : ''} ${role === 'Admin' ? 'bg-textMain hover:bg-black' : 'bg-primary hover:bg-primary/90'}`}
                    >
                        {loading ? 'Creating Account…' : `Register as ${role}`}
                    </button>

                    {/* Google OAuth – only for Users */}
                    {role === 'User' && (
                        <div className="mt-4 flex flex-col items-center">
                            <div className="mb-4 text-sm text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-3 w-full">
                                <span className="flex-1 h-px bg-gray-200"></span>Or continue with<span className="flex-1 h-px bg-gray-200"></span>
                            </div>
                            {GOOGLE_CLIENT_ID ? (
                                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google sign-in failed. Please try email registration.')}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        text="signup_with"
                                    />
                                </GoogleOAuthProvider>
                            ) : (
                                <div className="w-full text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg py-3">
                                    Google Sign-in not configured.<br />
                                    <span className="font-medium">Set VITE_GOOGLE_CLIENT_ID in your .env file to enable it.</span>
                                </div>
                            )}
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center text-sm text-textMain/70 space-y-2">
                    <div>
                        Already have an account?{' '}
                        <Link to={role === 'Admin' ? '/admin-login' : '/login'} className="text-primary hover:underline font-semibold">
                            Sign In <ExternalLink className="w-3 h-3 inline" />
                        </Link>
                    </div>
                    {role === 'User' && (
                        <div>
                            Admin staff?{' '}
                            <button onClick={() => setRole('Admin')} className="text-textMain hover:underline font-semibold">
                                Switch to Admin Registration
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
