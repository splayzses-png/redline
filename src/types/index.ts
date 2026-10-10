export type UserRole = 'player' | 'moderator' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  phone?: string;
  displayName: string;
  freeFireUid: string; // 8-12 digits numeric UID
  freeFireIgn: string; // Free Fire in-game name
  avatarUrl?: string;
  role: UserRole;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  status: 'active' | 'suspended' | 'banned';
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type GameMode = 'solo' | 'duo' | 'squad' | 'clash_squad' | 'custom';
export type MatchFormat = 'battle_royale' | 'clash_squad_best_of_3' | 'custom';
export type GameMap = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra' | 'Random';

export type TournamentStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'registration_closed'
  | 'check_in'
  | 'live'
  | 'provisional_results'
  | 'disputed'
  | 'finalized'
  | 'cancelled';

export interface PrizeBreakdown {
  rank: number;
  label: string; // e.g. "1st Place (Booyah)", "2nd Place", "Top Fragger"
  amountInr: number;
}

export interface Tournament {
  id: string;
  slug: string;
  title: string;
  bannerUrl?: string;
  gameMode: GameMode;
  matchFormat: MatchFormat;
  map: GameMap;
  status: TournamentStatus;
  isFree: boolean;
  entryFeeInr: number;
  prizePoolInr: number;
  prizeBreakdown: PrizeBreakdown[];
  totalSlots: number;
  filledSlots: number;
  confirmedSlots: number;
  startTime: string; // ISO date
  registrationDeadline: string;
  checkInWindowMinutes: number; // e.g. 15 minutes prior to match
  roomCredentialsReleased: boolean;
  rules: string;
  scoringRules: {
    killPoints: number;
    placementPoints: Record<number, number>; // e.g. { 1: 12, 2: 9, 3: 8, 4: 7, 5: 6, ... }
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SlotStatus = 'available' | 'held' | 'confirmed' | 'locked';

export interface TournamentSlot {
  slotNumber: number;
  status: SlotStatus;
  bookingId?: string;
  heldByUserId?: string;
  heldUntil?: string;
  playerIgn?: string;
  playerUid?: string;
  teamName?: string;
}

export type BookingStatus =
  | 'reserved'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'waitlisted'
  | 'rejected';

export interface Booking {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  tournamentStartTime: string;
  userId: string;
  userDisplayName: string;
  teamId?: string;
  teamName?: string;
  slotNumber: number;
  playerIgn: string;
  playerUid: string;
  status: BookingStatus;
  reservedAt: string;
  reservationExpiresAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  rosterSnapshot?: Array<{ ign: string; uid: string }>;
}

export interface TournamentRoom {
  tournamentId: string;
  roomId: string;
  roomPassword: string;
  customInstructions?: string;
  releasedAt?: string;
  releasedBy?: string;
  updatedAt: string;
}

export interface TeamMember {
  uid: string;
  displayName: string;
  freeFireUid: string;
  freeFireIgn: string;
  role: 'captain' | 'member';
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string; // e.g. [RL]
  captainUid: string;
  captainIgn: string;
  members: TeamMember[];
  logoUrl?: string;
  createdAt: string;
}

export interface ResultEntry {
  rank: number;
  teamOrPlayerName: string;
  freeFireUid: string;
  kills: number;
  killPoints: number;
  placementPoints: number;
  deductions: number;
  totalPoints: number;
  prizeWonInr?: number;
}

export interface TournamentResult {
  tournamentId: string;
  isProvisional: boolean;
  entries: ResultEntry[];
  publishedAt: string;
  publishedBy: string;
  updatedAt: string;
}

export type PrizeSettlementStatus =
  | 'pending_review'
  | 'approved'
  | 'settled'
  | 'rejected'
  | 'cancelled';

export interface PrizeRecord {
  id: string;
  userId: string;
  userDisplayName: string;
  tournamentId: string;
  tournamentTitle: string;
  rank: number;
  amountInr: number;
  status: PrizeSettlementStatus;
  settledAt?: string;
  manualPaymentReference?: string; // e.g. "UPI Ref #9482718471"
  adminNotes?: string;
  createdAt: string;
}

export type TicketCategory =
  | 'match_dispute'
  | 'slot_issue'
  | 'account_profile'
  | 'prize_settlement'
  | 'rule_violation'
  | 'other';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userDisplayName: string;
  tournamentId?: string;
  tournamentTitle?: string;
  category: TicketCategory;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedModerator?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'room_released' | 'booking_confirmed' | 'match_alert' | 'prize_settled' | 'general';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorDisplayName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  active: boolean;
  createdAt: string;
}
