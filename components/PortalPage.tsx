import React from 'react';
import { User } from 'firebase/auth';

interface PortalPageProps {
    user: User;
}

const PortalPage: React.FC<PortalPageProps> = ({ user }) => {
    return (
        <div className="py-16 pt-32 bg-dc-light min-h-screen">
            <div className="container mx-auto px-6">
                <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-subtle">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Welcome to the Club Portal</h1>
                    <p className="text-dc-text mt-4 max-w-2xl mx-auto">
                        This is your personal space as a member of the Dhaka College Cultural Club.
                    </p>
                    <div className="mt-8">
                        <p className="text-lg text-dc-blue font-semibold">Logged in as: {user.email}</p>
                    </div>
                     <div className="mt-10 border-t border-dc-gray pt-8">
                        <h2 className="text-2xl font-bold font-poppins text-dc-dark mb-4">Quick Links</h2>
                        <div className="flex justify-center flex-wrap gap-4">
                             <a href="#events" className="bg-gray-100 text-dc-dark font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                                Upcoming Events
                            </a>
                            <a href="#publications" className="bg-gray-100 text-dc-dark font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                                Read Publications
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalPage;