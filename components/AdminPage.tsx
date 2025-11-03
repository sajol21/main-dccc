import React, { useState } from 'react';
import { User } from 'firebase/auth';
import ManageEvents from './admin/ManageEvents';
import ManageCommittee from './admin/ManageCommittee';
import ViewMessages from './admin/ViewMessages';
import ManageAdvisors from './admin/ManageAdvisors';
import ManagePublications from './admin/ManagePublications';

type AdminView = 'dashboard' | 'events' | 'committee' | 'messages' | 'advisors' | 'publications';

const AdminPage: React.FC<{ user: User }> = ({ user }) => {
    const [view, setView] = useState<AdminView>('dashboard');

    const NavItem: React.FC<{ currentView: AdminView, targetView: AdminView, setView: (view: AdminView) => void, children: React.ReactNode, icon: React.ReactNode }> = 
    ({ currentView, targetView, setView, children, icon }) => {
        const isActive = currentView === targetView;
        return (
            <button
                onClick={() => setView(targetView)}
                className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 relative ${
                    isActive ? 'bg-blue-100 text-dc-blue' : 'text-dc-text hover:bg-gray-200'
                }`}
            >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-dc-blue rounded-l-lg"></div>}
                {icon}
                <span className="font-semibold">{children}</span>
            </button>
        );
    };

    const renderView = () => {
        switch (view) {
            case 'events':
                return <ManageEvents />;
            case 'committee':
                return <ManageCommittee />;
            case 'advisors':
                return <ManageAdvisors />;
            case 'publications':
                return <ManagePublications />;
            case 'messages':
                return <ViewMessages />;
            case 'dashboard':
            default:
                return (
                     <div className="text-center">
                        <h1 className="text-4xl font-bold font-poppins text-dc-dark">Admin Dashboard</h1>
                        <p className="text-dc-text mt-2">
                            Welcome, Admin. Select an option from the sidebar to manage website content.
                        </p>
                        <p className="mt-4 text-sm text-gray-500">Logged in as: {user.email}</p>
                    </div>
                );
        }
    };

    return (
        <div className="py-16 pt-24 bg-dc-light min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="md:w-1/4 lg:w-1/5">
                        <div className="bg-white rounded-xl p-4 shadow-subtle space-y-2">
                             <NavItem currentView={view} targetView="dashboard" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>
                                Dashboard
                            </NavItem>
                             <NavItem currentView={view} targetView="events" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                                Manage Events
                            </NavItem>
                            <NavItem currentView={view} targetView="committee" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                                Manage Committee
                            </NavItem>
                            <NavItem currentView={view} targetView="advisors" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                                Manage Advisors
                            </NavItem>
                             <NavItem currentView={view} targetView="publications" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>}>
                                Manage Publications
                            </NavItem>
                            <NavItem currentView={view} targetView="messages" setView={setView} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
                                View Messages
                            </NavItem>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="md:w-3/4 lg:w-4/5">
                         <div className="bg-white rounded-xl p-8 shadow-subtle min-h-[60vh]">
                            {renderView()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;