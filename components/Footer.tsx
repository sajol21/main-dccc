import React from 'react';
import { Page } from '../types';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-dc-blue transition-colors duration-300">
    {children}
  </a>
);

interface FooterProps {
    navigateTo: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({navigateTo}) => {
  return (
    <footer className="bg-white text-dc-dark border-t border-dc-gray">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
                <a href="#home" onClick={(e) => {e.preventDefault(); navigateTo(Page.Home)}} className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <img src="https://dhakacollegeculturalclub.com/logo.png" alt="Logo" className="h-9"/>
                </a>
                <p className="text-sm text-dc-text font-semibold">Know Thyself, Show Thyself.</p>
            </div>
          
            <div className="flex items-center space-x-4 mb-6 md:mb-0 flex-wrap justify-center">
                <a href="#about" onClick={(e) => { e.preventDefault(); navigateTo(Page.About); }} className="text-sm hover:text-dc-blue transition-colors">About</a>
                <a href="#events" onClick={(e) => { e.preventDefault(); navigateTo(Page.Events); }} className="text-sm hover:text-dc-blue transition-colors">Events</a>
                <a href="#committee" onClick={(e) => { e.preventDefault(); navigateTo(Page.Committee); }} className="text-sm hover:text-dc-blue transition-colors">Committee</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo(Page.Contact); }} className="text-sm hover:text-dc-blue transition-colors">Contact</a>
            </div>

            <div className="flex space-x-6">
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.823v-7.04l6.02 3.52-6.02 3.52z" /></svg>
              </SocialIcon>
            </div>
        </div>
        <div className="mt-8 border-t border-dc-gray pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dhaka College Cultural Club — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;