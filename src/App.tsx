import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AnnouncementBanner } from './components/layout/AnnouncementBanner';

// Public pages
import { Home } from './pages/public/Home';
import { Tournaments } from './pages/public/Tournaments';
import { TournamentDetail } from './pages/public/TournamentDetail';
import { Results } from './pages/public/Results';
import { Rules } from './pages/public/Rules';
import { Privacy } from './pages/public/Privacy';
import { Terms } from './pages/public/Terms';
import { Support } from './pages/public/Support';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Player pages
import { Dashboard } from './pages/player/Dashboard';
import { Profile } from './pages/player/Profile';
import { Bookings } from './pages/player/Bookings';
import { BookingDetail } from './pages/player/BookingDetail';
import { Teams } from './pages/player/Teams';
import { TeamDetail } from './pages/player/TeamDetail';
import { Wallet } from './pages/player/Wallet';
import { Referrals } from './pages/player/Referrals';
import { Notifications } from './pages/player/Notifications';
import { PlayerSupport } from './pages/player/PlayerSupport';

// Admin pages
import { AdminPage } from './pages/admin/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderRoute = () => {
    // Exact paths
    if (currentPath === '/') return <Home onNavigate={navigate} />;
    if (currentPath === '/tournaments') return <Tournaments onNavigate={navigate} />;
    if (currentPath === '/results') return <Results />;
    if (currentPath === '/rules') return <Rules />;
    if (currentPath === '/privacy') return <Privacy />;
    if (currentPath === '/terms') return <Terms />;
    if (currentPath === '/support') return <Support onNavigate={navigate} />;

    // Auth
    if (currentPath === '/login') return <Login onNavigate={navigate} />;
    if (currentPath === '/register') return <Register onNavigate={navigate} />;
    if (currentPath === '/forgot-password') return <ForgotPassword onNavigate={navigate} />;

    // Player Dashboard
    if (currentPath === '/dashboard') return <Dashboard onNavigate={navigate} />;
    if (currentPath === '/dashboard/profile') return <Profile />;
    if (currentPath === '/dashboard/bookings') return <Bookings onNavigate={navigate} />;
    if (currentPath === '/dashboard/teams') return <Teams onNavigate={navigate} />;
    if (currentPath === '/dashboard/wallet') return <Wallet />;
    if (currentPath === '/dashboard/referrals') return <Referrals />;
    if (currentPath === '/dashboard/notifications') return <Notifications onNavigate={navigate} />;
    if (currentPath === '/dashboard/support') return <PlayerSupport />;

    // Dynamic Tournament Detail (/tournaments/:slug)
    if (currentPath.startsWith('/tournaments/')) {
      const slug = currentPath.replace('/tournaments/', '');
      return <TournamentDetail slug={slug} onNavigate={navigate} />;
    }

    // Dynamic Booking Detail (/dashboard/bookings/:id)
    if (currentPath.startsWith('/dashboard/bookings/')) {
      const id = currentPath.replace('/dashboard/bookings/', '');
      return <BookingDetail bookingId={id} onNavigate={navigate} />;
    }

    // Dynamic Team Detail (/dashboard/teams/:id)
    if (currentPath.startsWith('/dashboard/teams/')) {
      const id = currentPath.replace('/dashboard/teams/', '');
      return <TeamDetail teamId={id} onNavigate={navigate} />;
    }

    // Admin pages
    if (currentPath.startsWith('/admin')) {
      return <AdminPage onNavigate={navigate} />;
    }

    // Fallback to Home
    return <Home onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col font-['Inter'] selection:bg-rose-600 selection:text-white">
        <AnnouncementBanner />
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">{renderRoute()}</main>
        <Footer onNavigate={navigate} />
      </div>
    </AuthProvider>
  );
}
