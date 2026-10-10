import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  Trophy,
  Award,
  BookOpen,
  LifeBuoy,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import type { UserRole } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, logout, switchDemoRole, unreadNotificationsCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tournaments', path: '/tournaments', icon: Trophy },
    { label: 'Results', path: '/results', icon: Award },
    { label: 'Rules & Fair Play', path: '/rules', icon: BookOpen },
    { label: 'Support', path: '/support', icon: LifeBuoy },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0b0e]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-['Teko'] text-2xl font-bold tracking-wider text-white">REDLINE</span>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-600/30 text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded">
                  FF
                </span>
              </div>
              <span className="text-[9px] tracking-[0.2em] font-extrabold uppercase text-zinc-400 block -mt-1 font-sans">
                PAID SCRIMS
              </span>
            </div>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT CONTROLS */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Testing Switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
              <span className="text-[10px] text-zinc-500 font-bold uppercase px-1.5">Role:</span>
              {(['player', 'moderator', 'owner'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => switchDemoRole(role)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition ${
                    currentUser?.role === role
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title={`Test platform as ${role}`}
                >
                  {role}
                </button>
              ))}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/dashboard/notifications')}
                  className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Dashboard button */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('/dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition border ${
                    currentPath.startsWith('/dashboard')
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                      : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-rose-400" />
                  <span>Dashboard</span>
                </button>

                {/* Admin button if moderator/owner */}
                {currentUser.role !== 'player' && (
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition border ${
                      currentPath.startsWith('/admin')
                        ? 'bg-rose-950/60 text-rose-300 border-rose-700'
                        : 'bg-rose-900/20 text-rose-400 border-rose-800/50 hover:bg-rose-900/40'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span>Admin Desk</span>
                  </button>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLinkClick('/login')}
                  className="px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white uppercase transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('/register')}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition"
                >
                  Join Scrims
                </button>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase">Test Role Switcher:</span>
            <div className="flex items-center gap-1">
              {(['player', 'moderator', 'owner'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => switchDemoRole(role)}
                  className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    currentUser?.role === role ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
                >
                  <Icon className="w-4 h-4 text-rose-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleLinkClick('/dashboard')}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-bold uppercase text-zinc-100 bg-zinc-900"
                >
                  <LayoutDashboard className="w-4 h-4 text-rose-500" />
                  <span>Player Dashboard</span>
                </button>
                {currentUser.role !== 'player' && (
                  <button
                    onClick={() => handleLinkClick('/admin')}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-bold uppercase text-rose-300 bg-rose-950/40 border border-rose-800/40"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>Admin Operations Desk</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-2 rounded-lg text-xs font-bold uppercase text-center bg-zinc-900 text-zinc-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleLinkClick('/register')}
                  className="w-full py-2 rounded-lg text-xs font-bold uppercase text-center bg-rose-600 text-white"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
