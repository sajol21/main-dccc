import React from 'react';
import { User } from 'firebase/auth';

interface AdminPageProps {
    user: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
    return (
        <div className="py-16 pt-32 bg-dc-light min-h-screen">
            <div className="container mx-auto px-6">
                <div className="bg-white rounded-xl p-8 md:p-12 shadow-subtle">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-poppins text-dc-blue">Admin Panel</h1>
                        <p className="text-dc-text mt-4 max-w-2xl mx-auto">
                            Welcome, Admin. Manage website content and members from here.
                        </p>
                        <p className="mt-4 text-sm text-gray-500">Logged in as: {user.email}</p>
                    </div>
                    
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 border border-dc-gray rounded-lg p-6 text-center hover:border-dc-blue transition-colors">
                            <h3 className="text-xl font-bold text-dc-dark">Manage Events</h3>
                            <p className="text-dc-text text-sm mt-2">Add, edit, or remove club events.</p>
                            <button className="mt-4 bg-dc-blue text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">
                                Go to Events
                            </button>
                        </div>
                         <div className="bg-gray-50 border border-dc-gray rounded-lg p-6 text-center hover:border-dc-blue transition-colors">
                            <h3 className="text-xl font-bold text-dc-dark">Manage Committee</h3>
                            <p className="text-dc-text text-sm mt-2">Update committee member details.</p>
                             <button className="mt-4 bg-dc-blue text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">
                                Go to Committee
                            </button>
                        </div>
                         <div className="bg-gray-50 border border-dc-gray rounded-lg p-6 text-center hover:border-dc-blue transition-colors">
                            <h3 className="text-xl font-bold text-dc-dark">View Messages</h3>
                            <p className="text-dc-text text-sm mt-2">Read messages from the contact form.</p>
                             <button className="mt-4 bg-dc-blue text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">
                                Go to Messages
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;