import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import CommitteePage from './components/CommitteePage';
import EventsPage from './components/EventsPage';
import PublicationsPage from './components/PublicationsPage';
import JoinUsPage from './components/JoinUsPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PortalPage from './components/PortalPage';
import AdminPage from './components/AdminPage';
import { Page } from './types';
import { auth, onAuthChanged, checkAdminStatus } from './services/authService';
import { User } from 'firebase/auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    return Object.values(Page).includes(hash) ? hash : Page.Home;
  });
  
  useEffect(() => {
    const unsubscribe = onAuthChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (Object.values(Page).includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo(0, 0);
      } else {
        setCurrentPage(Page.Home);
        window.location.hash = Page.Home;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (page: Page) => {
    window.location.hash = page;
  };
  
  const handleAuthSuccess = (admin: boolean) => {
    setIsAdmin(admin);
    navigateTo(admin ? Page.Admin : Page.Portal);
  };

  const renderPage = () => {
    if (!authChecked) {
      return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
    }
    
    switch (currentPage) {
      case Page.Home:
        return <HomePage navigateTo={navigateTo} />;
      case Page.About:
        return <AboutPage />;
      case Page.Committee:
        return <CommitteePage />;
      case Page.Events:
        return <EventsPage />;
      case Page.Publications:
        return <PublicationsPage />;
      case Page.Join:
        return <JoinUsPage navigateTo={navigateTo} />;
      case Page.Contact:
        return <ContactPage />;
      case Page.Login:
        return <LoginPage onLoginSuccess={handleAuthSuccess} navigateTo={navigateTo}/>;
      case Page.Register:
        return <RegisterPage onRegisterSuccess={handleAuthSuccess} navigateTo={navigateTo}/>;
      case Page.Portal:
        return currentUser ? <PortalPage user={currentUser}/> : <LoginPage onLoginSuccess={handleAuthSuccess} navigateTo={navigateTo}/>;
      case Page.Admin:
         return currentUser && isAdmin ? <AdminPage user={currentUser}/> : <LoginPage onLoginSuccess={handleAuthSuccess} navigateTo={navigateTo}/>;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-dc-light text-dc-dark font-sans">
      <Header currentPage={currentPage} navigateTo={navigateTo} isAuthenticated={!!currentUser} />
      <main className="min-h-screen">
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
};

export default App;