import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Trophy,
  Users,
  Grid,
  KeyRound,
  Award,
  Wallet,
  Gift,
  LifeBuoy,
  Megaphone,
  UserCheck,
  FileText,
  Sliders,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  currentAdminTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  onSelectTab,
  children,
}) => {
  const { currentUser } = useAuth();

  const isOwner = currentUser?.role === 'owner';

  const menuItems = [
    { id: 'overview', label: 'Command Center', icon: ShieldAlert },
    { id: 'tournaments', label: 'Tournaments Desk', icon: Trophy },
    { id: 'slots', label: 'Slot Operations', icon: Grid },
    { id: 'participants', label: 'Participant Rosters', icon: Users },
    { id: 'room', label: 'Room Credentials Desk', icon: KeyRound },
    { id: 'results', label: 'Results & Scoring', icon: Award },
    { id: 'prizes', label: 'Prize Distribution', icon: Wallet },
    { id: 'bookings', label: 'Global Bookings', icon: Calendar },
    { id: 'users', label: 'Player Management', icon: Users },
    { id: 'teams', label: 'Squad & Clan Desk', icon: Users },
    { id: 'payments', label: 'Payments (Gated)', icon: Wallet },
    { id: 'referrals', label: 'Referrals Audit', icon: Gift },
    { id: 'support', label: 'Moderator Support Desk', icon: LifeBuoy },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'moderators', label: 'Roles & Moderators', icon: UserCheck },
    { id: 'audit-log', label: 'Audit Trail', icon: FileText },
    { id: 'settings', label: 'Settings & Flags', icon: Sliders },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wide leading-none">
                REDLINE Tournament Operations
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-600 text-white shadow">
                {currentUser?.role.toUpperCase()} LEVEL
              </span>
            </div>
            <p className="text-zinc-400 text-xs">
              Esports Match Management • Slot Allocation • Secure Room Release • Prize Settlements
            </p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-zinc-500 font-mono block">Logged in as {currentUser?.displayName}</span>
          <span className="text-emerald-400 font-semibold font-mono text-[11px]">
            ● Role Verified: {currentUser?.role}
          </span>
        </div>
      </div>

      {/* HORIZONTAL TAB SCROLL FOR MOBILE & DESKTOP */}
      <div className="overflow-x-auto pb-2 border-b border-zinc-800 flex gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentAdminTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-zinc-900/70 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="pt-2">{children}</div>
    </div>
  );
};
