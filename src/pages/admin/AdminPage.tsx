import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminOverview } from './AdminOverview';
import { AdminTournaments } from './AdminTournaments';
import { AdminSlots } from './AdminSlots';
import { AdminParticipants } from './AdminParticipants';
import { AdminRoom } from './AdminRoom';
import { AdminResults } from './AdminResults';
import { AdminPrizes } from './AdminPrizes';
import { AdminBookings } from './AdminBookings';
import { AdminUsers } from './AdminUsers';
import { AdminTeams } from './AdminTeams';
import { AdminPayments } from './AdminPayments';
import { AdminReferrals } from './AdminReferrals';
import { AdminSupport } from './AdminSupport';
import { AdminAnnouncements } from './AdminAnnouncements';
import { AdminModerators } from './AdminModerators';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminSettings } from './AdminSettings';
import { ShieldAlert } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, switchDemoRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // RBAC check: Must be moderator or owner
  if (!currentUser || currentUser.role === 'player') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white">
          Restricted Staff Area
        </h2>
        <p className="text-xs text-zinc-400">
          This operations desk requires verified Moderator or Owner clearance.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => switchDemoRole('owner')}
            className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
          >
            Switch to Demo Owner Role
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs text-zinc-500 hover:text-white"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview onSelectTab={(tab) => setCurrentTab(tab)} />;
      case 'tournaments':
        return <AdminTournaments />;
      case 'slots':
        return <AdminSlots />;
      case 'participants':
        return <AdminParticipants />;
      case 'room':
        return <AdminRoom />;
      case 'results':
        return <AdminResults />;
      case 'prizes':
        return <AdminPrizes />;
      case 'bookings':
        return <AdminBookings />;
      case 'users':
        return <AdminUsers />;
      case 'teams':
        return <AdminTeams />;
      case 'payments':
        return <AdminPayments />;
      case 'referrals':
        return <AdminReferrals />;
      case 'support':
        return <AdminSupport />;
      case 'announcements':
        return <AdminAnnouncements />;
      case 'moderators':
        return <AdminModerators />;
      case 'audit-log':
        return <AdminAuditLog />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview onSelectTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <AdminLayout currentAdminTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)}>
      {renderContent()}
    </AdminLayout>
  );
};
