import React from 'react';
import { Page } from '../types';

const BenefitCard: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white rounded-xl p-6 text-center shadow-subtle">
        <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-dc-dark mb-2">{title}</h3>
        <p className="text-dc-text text-sm">{description}</p>
    </div>
);

const JoinUsPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
    return (
        <div className="py-16 pt-24 bg-dc-light">
            {/* Hero Section */}
            <div className="text-center bg-white py-20 px-6">
                <h1 className="text-4xl md:text-6xl font-extrabold font-poppins text-dc-dark tracking-tight">
                    Become Part of the Legacy.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-dc-text">
                    Join Dhaka College Cultural Club and unleash your creative potential, build lifelong friendships, and shape the cultural landscape of our historic institution.
                </p>
                <button
                    onClick={() => navigateTo(Page.Register)}
                    className="mt-8 bg-dc-gold text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-amber-500 transition-transform hover:scale-105 duration-300 shadow-lg"
                >
                    Register Now
                </button>
            </div>

            {/* Why Join Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-poppins text-dc-blue">Why Join DCCC?</h2>
                    <p className="text-dc-text mt-2">Discover a platform for growth, creativity, and community.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <BenefitCard 
                        title="Showcase Your Talent" 
                        description="From stage to page, get countless opportunities to display your skills in drama, music, debate, literature, and more."
                        icon={<svg className="w-8 h-8 text-dc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>}
                    />
                    <BenefitCard 
                        title="Develop New Skills" 
                        description="Learn event management, public speaking, teamwork, and leadership in a supportive and hands-on environment."
                        icon={<svg className="w-8 h-8 text-dc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    />
                    <BenefitCard 
                        title="Build Your Network" 
                        description="Connect with fellow students, esteemed faculty, alumni, and guest artists, building a network that lasts a lifetime."
                        icon={<svg className="w-8 h-8 text-dc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                </div>
            </div>
            
            {/* Final CTA */}
            <div className="container mx-auto px-6 text-center">
                 <div className="bg-dc-blue text-white rounded-xl p-12">
                     <h2 className="text-3xl font-bold mb-4">Ready to Make Your Mark?</h2>
                     <p className="max-w-xl mx-auto mb-6">Your journey into the vibrant world of arts and culture at Dhaka College starts here.</p>
                     <button
                        onClick={() => navigateTo(Page.Register)}
                        className="bg-white text-dc-blue font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-colors"
                    >
                        Create Your Account
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default JoinUsPage;
