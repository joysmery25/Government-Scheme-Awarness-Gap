import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, ArrowRight, ShieldCheck, FileText, Users } from 'lucide-react';

export default function Home() {
    return (
        <div className="space-y-24 pb-12">
            {/* Hero Section */}
            <section className="text-center pt-16 pb-12 fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold text-textMain mb-6 tracking-tight">
                    Find Government Schemes <br className="hidden md:block" />
                    <span className="text-primary">You Are Eligible For</span>
                </h1>
                <p className="text-xl text-textMain/70 max-w-2xl mx-auto mb-10">
                    Discover Central Government and Andhra Pradesh state welfare schemes. Check eligibility, required documents, and apply easily.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/schemes" className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/30 w-full sm:w-auto justify-center">
                        <Search className="w-5 h-5" /> All Schemes
                    </Link>
                    <Link to="/eligibility" className="px-8 py-4 bg-white text-primary border-2 border-primary font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center">
                        <CheckCircle className="w-5 h-5" /> Eligibility Checker
                    </Link>
                </div>
            </section>

            {/* How it Works */}
            <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-borders slide-up">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-textMain">How It Works</h2>
                    <p className="text-textMain/70 mt-2">Three simple steps to find and apply for relevant schemes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Check Eligibility</h3>
                        <p className="text-textMain/70">Enter your basic details in our eligibility checker tool.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Find Schemes</h3>
                        <p className="text-textMain/70">Our engine matches you with schemes you qualify for.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Learn & Apply</h3>
                        <p className="text-textMain/70">Get details on documents needed and official links to apply.</p>
                    </div>
                </div>
            </section>

            {/* Benefits / Features */}
            <section className="slide-up">
                <h2 className="text-3xl font-bold text-center mb-12">Portal Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-borders shadow-sm flex flex-col items-start hover:border-secondary transition-colors">
                        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold mb-2">Verified Information</h3>
                        <p className="text-textMain/70">All scheme details are curated from official government sources.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-borders shadow-sm flex flex-col items-start hover:border-secondary transition-colors">
                        <FileText className="w-10 h-10 text-accent mb-4" />
                        <h3 className="text-lg font-bold mb-2">Clear Requirements</h3>
                        <p className="text-textMain/70">Know exactly what documents you need before starting your application.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-borders shadow-sm flex flex-col items-start hover:border-secondary transition-colors">
                        <Users className="w-10 h-10 text-purple-500 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Personalized For You</h3>
                        <p className="text-textMain/70">Recommendations tailored to your profile, category, and occupation.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials / Stats */}
            <section className="bg-primary text-white rounded-2xl p-8 md:p-12 shadow-lg slide-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-extrabold mb-2">100+</div>
                        <div className="text-white/80">Active Schemes</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2">26</div>
                        <div className="text-white/80">Districts Covered</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2">10M+</div>
                        <div className="text-white/80">Citizens Helped</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold mb-2">₹50k+</div>
                        <div className="text-white/80">Cr Benefits Disbursed</div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="slide-up max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-borders">
                        <h4 className="font-bold text-lg mb-2">Is this an official government website?</h4>
                        <p className="text-textMain/70">No, this is an awareness portal designed to help citizens find relevant schemes. We redirect you to official portals for actual applications.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-borders">
                        <h4 className="font-bold text-lg mb-2">Do I have to pay to use this tracker?</h4>
                        <p className="text-textMain/70">No, this portal is completely free of cost for all citizens.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-borders">
                        <h4 className="font-bold text-lg mb-2">How accurate is the eligibility checker?</h4>
                        <p className="text-textMain/70">Our engine uses basic criteria (age, income, category) to suggest schemes. Final eligibility is determined by the respective government department upon verification.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
