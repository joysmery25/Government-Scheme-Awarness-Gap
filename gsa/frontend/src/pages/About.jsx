import React from 'react';
import { ShieldCheck, Target, Users } from 'lucide-react';

export default function About() {
    return (
        <div className="fade-in max-w-4xl mx-auto space-y-12 pb-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-4">About Our Portal</h1>
                <p className="text-xl text-textMain/70">Connecting Citizens with the Benefits They Deserve.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-borders shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-textMain/80 leading-relaxed">
                    The Government Scheme Awareness Portal was built to solve a simple but widespread problem: millions of citizens remain unaware of the welfare schemes designed for them.
                    By bridging the information gap, we empower individuals, farmers, students, and marginalized communities to easily discover and apply for Central and State (Andhra Pradesh) government initiatives.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <Target className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Accuracy</h3>
                    <p className="text-sm text-textMain/70">We ensure that all scheme information is curated directly from trusted and official sources.</p>
                </div>
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Privacy</h3>
                    <p className="text-sm text-textMain/70">Your profile data is strictly used to check eligibility locally. We do not share it with third parties.</p>
                </div>
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <Users className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Community First</h3>
                    <p className="text-sm text-textMain/70">Built with accessibility and simplicity in mind, ensuring anyone can use the portal.</p>
                </div>
            </div>
        </div>
    );
}
