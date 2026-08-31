import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-borders mt-12 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <span className="text-2xl font-extrabold text-primary flex items-center gap-2">
                            <Shield className="w-8 h-8 text-accent" />
                            GovScheme Portal
                        </span>
                        <p className="text-sm text-textMain/80">
                            Empowering citizens by raising awareness about Central and State Government welfare schemes.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-textMain">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/schemes" className="text-sm hover:text-primary">All Schemes</Link></li>
                            <li><Link to="/eligibility" className="text-sm hover:text-primary">Eligibility Checker</Link></li>
                            <li><Link to="/about" className="text-sm hover:text-primary">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-textMain">Government Portals</h3>
                        <ul className="space-y-2">
                            <li><a href="https://www.india.gov.in/" target="_blank" rel="noreferrer" className="text-sm hover:text-primary">National Portal of India</a></li>
                            <li><a href="https://www.ap.gov.in/" target="_blank" rel="noreferrer" className="text-sm hover:text-primary">AP State Portal</a></li>
                            <li><a href="https://mygov.in/" target="_blank" rel="noreferrer" className="text-sm hover:text-primary">MyGov</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-textMain">Connect with Us</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-textMain hover:text-primary"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-textMain hover:text-primary"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-textMain hover:text-primary"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-textMain hover:text-primary"><Mail className="w-5 h-5" /></a>
                        </div>
                        <p className="text-sm text-textMain/80">Helpline: 1800-111-2222 (Toll Free)</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-borders text-center text-sm text-textMain/60">
                    &copy; {new Date().getFullYear()} Government Scheme Awareness Portal. All rights reserved. (Not a real govt site)
                </div>
            </div>
        </footer>
    );
}
