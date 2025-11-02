import React, { useState } from 'react';
import { Page } from '../types';
import { handleLogout } from '../services/authService';

interface HeaderProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  isAuthenticated: boolean;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  navigateTo: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, navigateTo, children }) => {
  const isActive = currentPage === page;
  return (
    <a
      href={`#${page}`}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(page);
      }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
        isActive
          ? 'text-dc-blue font-semibold'
          : 'text-dc-text hover:text-dc-dark'
      }`}
    >
      {children}
    </a>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, navigateTo, isAuthenticated }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { page: Page.Home, label: 'Home' },
    { page: Page.About, label: 'About' },
    { page: Page.Committee, label: 'Committee' },
    { page: Page.Events, label: 'Events' },
    { page: Page.Publications, label: 'Publications' },
    { page: Page.Contact, label: 'Contact' },
  ];
  
  const onLogout = async () => {
    try {
        await handleLogout();
        navigateTo(Page.Home);
    } catch(error) {
        console.error("Failed to log out", error);
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-dc-gray/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <a href="#home" onClick={(e) => {e.preventDefault(); navigateTo(Page.Home)}} className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Dhaka College Cultural Club Logo" className="h-9 w-auto" />
            <span className="font-bold text-lg text-dc-dark hidden sm:inline">DCCC</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map(item => (
              <NavLink key={item.page} page={item.page} currentPage={currentPage} navigateTo={navigateTo}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
                <>
                    <a href={`#${Page.Portal}`} onClick={(e) => {e.preventDefault(); navigateTo(Page.Portal)}} className="bg-dc-blue text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300">
                        Go to Portal
                    </a>
                    <button onClick={onLogout} className="text-dc-text font-semibold text-sm py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                        Logout
                    </button>
                </>
            ) : (
                <a href={`#${Page.Login}`} onClick={(e) => {e.preventDefault(); navigateTo(Page.Login)}} className="bg-dc-blue text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-800 transition-colors duration-300">
                    Portal Login
                </a>
            )}
          </div>

          {/* Mobile Nav Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-dc-text hover:text-dc-dark hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
                 <a
                    key={item.page}
                    href={`#${item.page}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigateTo(item.page);
                        setMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium text-center ${
                        currentPage === item.page
                        ? 'bg-blue-100 text-dc-blue'
                        : 'text-dc-dark hover:bg-gray-100'
                    }`}
                >
                    {item.label}
                </a>
            ))}
             <div className="border-t border-dc-gray mt-4 pt-4">
                 {isAuthenticated ? (
                     <div className="flex flex-col space-y-2 px-2">
                        <a href={`#${Page.Portal}`} onClick={(e) => {e.preventDefault(); navigateTo(Page.Portal); setMobileMenuOpen(false);}} className="text-center bg-dc-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
                           Go to Portal
                        </a>
                        <button onClick={()=>{onLogout(); setMobileMenuOpen(false);}} className="text-center text-dc-text font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300">
                           Logout
                        </button>
                     </div>
                 ) : (
                    <a href={`#${Page.Login}`} onClick={(e) => {e.preventDefault(); navigateTo(Page.Login); setMobileMenuOpen(false);}} className="block text-center bg-dc-blue text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-800 transition-colors duration-300">
                       Portal Login
                    </a>
                 )}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;