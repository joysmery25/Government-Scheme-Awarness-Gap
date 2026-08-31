import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [toast, setToast] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setToast('Your message has been sent. We will get back to you soon!');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setToast(''), 4000);
    };

    return (
        <div className="fade-in max-w-5xl mx-auto pb-12 relative">
            {toast && (
                <div className="fixed top-20 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 slide-up">
                    {toast}
                </div>
            )}

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-primary mb-4">Contact Us</h1>
                <p className="text-xl text-textMain/70">Need help? We're here to assist you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-white rounded-xl p-8 border border-borders shadow-sm">
                        <h3 className="font-bold text-2xl mb-6">Get in Touch</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-full text-primary"><Phone className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold text-lg border-b pb-1">Helpline Number</h4>
                                    <p className="text-textMain/70 mt-1">1800-111-2222 (Toll Free)</p>
                                    <p className="text-sm text-gray-500">Available 9 AM to 6 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-full text-accent"><Mail className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold text-lg border-b pb-1">Email Support</h4>
                                    <p className="text-textMain/70 mt-1">support@govschemes.example.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-50 p-3 rounded-full text-purple-600"><MapPin className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold text-lg border-b pb-1">Office Location</h4>
                                    <p className="text-textMain/70 mt-1">
                                        Central Scheme Directorate<br />
                                        Block 4, Secretariat Campus<br />
                                        Vijayawada, Andhra Pradesh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-borders shadow-sm space-y-6">
                    <h3 className="font-bold text-2xl mb-2">Send a Message</h3>
                    <p className="text-sm text-gray-500 mb-6">If you have specific issues regarding your eligibility result or website technical issue.</p>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Your Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Message</label>
                        <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required rows="4" className="w-full p-3 border rounded-lg focus:border-primary outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                        Send Message <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
