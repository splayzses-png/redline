import {
  INITIAL_USERS,
  INITIAL_TOURNAMENTS,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_TEAMS,
  INITIAL_RESULTS,
  INITIAL_PRIZES,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/seedData';
import type {
  Tournament,
  UserProfile,
  Booking,
  TournamentRoom,
  TournamentSlot,
  Team,
  TournamentResult,
  PrizeRecord,
  SupportTicket,
  InAppNotification,
  AuditLog,
  Announcement,
  ResultEntry,
  TicketCategory,
} from '../types';

interface StoreState {
  users: UserProfile[];
  tournaments: Tournament[];
  rooms: Record<string, TournamentRoom>;
  bookings: Booking[];
  teams: Team[];
  results: Record<string, TournamentResult>;
  prizes: PrizeRecord[];
  tickets: SupportTicket[];
  notifications: InAppNotification[];
  auditLogs: AuditLog[];
  announcements: Announcement[];
}

const STORAGE_KEY = 'redline_data_store_v1';

class RedlineStore {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): StoreState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved REDLINE store, initializing defaults', e);
    }
    return {
      users: [...INITIAL_USERS],
      tournaments: [...INITIAL_TOURNAMENTS],
      rooms: { ...INITIAL_ROOMS },
      bookings: [...INITIAL_BOOKINGS],
      teams: [...INITIAL_TEAMS],
      results: { ...INITIAL_RESULTS },
      prizes: [...INITIAL_PRIZES],
      tickets: [...INITIAL_TICKETS],
      notifications: [...INITIAL_NOTIFICATIONS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      announcements: [...INITIAL_ANNOUNCEMENTS],
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist store', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public resetToDefaults() {
    this.state = {
      users: [...INITIAL_USERS],
      tournaments: [...INITIAL_TOURNAMENTS],
      rooms: { ...INITIAL_ROOMS },
      bookings: [...INITIAL_BOOKINGS],
      teams: [...INITIAL_TEAMS],
      results: { ...INITIAL_RESULTS },
      prizes: [...INITIAL_PRIZES],
      tickets: [...INITIAL_TICKETS],
      notifications: [...INITIAL_NOTIFICATIONS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      announcements: [...INITIAL_ANNOUNCEMENTS],
    };
    this.persist();
  }

  // ----------------------------------------------------
  // USERS
  // ----------------------------------------------------
  public getUsers(): UserProfile[] {
    return [...this.state.users];
  }

  public getUser(uid: string): UserProfile | undefined {
    return this.state.users.find((u) => u.uid === uid);
  }

  public saveUser(user: UserProfile) {
    const idx = this.state.users.findIndex((u) => u.uid === user.uid);
    if (idx >= 0) {
      this.state.users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      this.state.users.push(user);
    }
    this.persist();
  }

  // ----------------------------------------------------
  // TOURNAMENTS
  // ----------------------------------------------------
  public getTournaments(): Tournament[] {
    return [...this.state.tournaments];
  }

  public getTournament(idOrSlug: string): Tournament | undefined {
    return this.state.tournaments.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  }

  public saveTournament(tournament: Tournament, actor: UserProfile) {
    const idx = this.state.tournaments.findIndex((t) => t.id === tournament.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      this.state.tournaments[idx] = { ...tournament, updatedAt: now };
      this.logAction(actor, 'UPDATE_TOURNAMENT', 'tournament', tournament.id, `Updated tournament ${tournament.title}`);
    } else {
      this.state.tournaments.unshift({ ...tournament, createdAt: now, updatedAt: now });
      this.logAction(actor, 'CREATE_TOURNAMENT', 'tournament', tournament.id, `Created tournament ${tournament.title}`);
    }
    this.persist();
  }

  public updateTournamentStatus(id: string, status: Tournament['status'], actor: UserProfile) {
    const tourney = this.state.tournaments.find((t) => t.id === id);
    if (tourney) {
      const prev = tourney.status;
      tourney.status = status;
      tourney.updatedAt = new Date().toISOString();
      this.logAction(actor, 'CHANGE_TOURNAMENT_STATUS', 'tournament', id, `Changed status from ${prev} to ${status}`);
      this.persist();
    }
  }

  // Generate real-time Slot Matrix for a tournament
  public getTournamentSlots(tournamentId: string): TournamentSlot[] {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) return [];

    const bookings = this.state.bookings.filter(
      (b) => b.tournamentId === tournament.id && b.status !== 'cancelled' && b.status !== 'rejected'
    );

    const now = new Date().getTime();
    const slots: TournamentSlot[] = [];

    for (let i = 1; i <= tournament.totalSlots; i++) {
      const booking = bookings.find((b) => b.slotNumber === i);
      if (!booking) {
        slots.push({ slotNumber: i, status: 'available' });
      } else if (booking.status === 'reserved') {
        const expires = new Date(booking.reservationExpiresAt).getTime();
        if (expires > now) {
          slots.push({
            slotNumber: i,
            status: 'held',
            bookingId: booking.id,
            heldByUserId: booking.userId,
            heldUntil: booking.reservationExpiresAt,
            playerIgn: booking.playerIgn,
            playerUid: booking.playerUid,
            teamName: booking.teamName,
          });
        } else {
          // expired hold
          slots.push({ slotNumber: i, status: 'available' });
        }
      } else {
        slots.push({
          slotNumber: i,
          status: 'confirmed',
          bookingId: booking.id,
          playerIgn: booking.playerIgn,
          playerUid: booking.playerUid,
          teamName: booking.teamName,
        });
      }
    }
    return slots;
  }

  // ----------------------------------------------------
  // BOOKINGS (Concurrency & Hold Engine)
  // ----------------------------------------------------
  public getBookings(userId?: string): Booking[] {
    if (userId) {
      return this.state.bookings.filter((b) => b.userId === userId);
    }
    return [...this.state.bookings];
  }

  public getBooking(bookingId: string): Booking | undefined {
    return this.state.bookings.find((b) => b.id === bookingId);
  }

  public reserveSlot(
    tournamentId: string,
    slotNumber: number,
    user: UserProfile,
    teamId?: string,
    teamName?: string
  ): { success: boolean; booking?: Booking; error?: string } {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    if (tournament.status !== 'registration_open') {
      return { success: false, error: 'Registration is not open for this tournament' };
    }

    if (!user.freeFireUid || !user.freeFireIgn) {
      return { success: false, error: 'Free Fire UID and In-Game Name must be verified before booking' };
    }

    // Check if user already has an active booking for this tournament
    const existing = this.state.bookings.find(
      (b) =>
        b.tournamentId === tournament.id &&
        b.userId === user.uid &&
        b.status !== 'cancelled' &&
        b.status !== 'rejected'
    );
    if (existing) {
      return { success: false, error: 'You already have an active registration for this tournament' };
    }

    // Check slot availability
    const slots = this.getTournamentSlots(tournament.id);
    const targetSlot = slots.find((s) => s.slotNumber === slotNumber);
    if (!targetSlot || targetSlot.status !== 'available') {
      return { success: false, error: `Slot #${slotNumber} is already occupied or held by another participant` };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5-minute hold

    const booking: Booking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tournamentId: tournament.id,
      tournamentTitle: tournament.title,
      tournamentStartTime: tournament.startTime,
      userId: user.uid,
      userDisplayName: user.displayName,
      teamId,
      teamName,
      slotNumber,
      playerIgn: user.freeFireIgn,
      playerUid: user.freeFireUid,
      status: 'reserved',
      reservedAt: now.toISOString(),
      reservationExpiresAt: expiresAt.toISOString(),
    };

    this.state.bookings.push(booking);
    this.persist();
    return { success: true, booking };
  }

  public confirmBooking(bookingId: string, userId: string): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId && b.userId === userId);
    if (!booking) return { success: false, error: 'Booking reservation not found' };

    if (booking.status !== 'reserved') {
      return { success: false, error: 'Booking is already confirmed or cancelled' };
    }

    const now = new Date().getTime();
    const expires = new Date(booking.reservationExpiresAt).getTime();
    if (now > expires) {
      booking.status = 'cancelled';
      this.persist();
      return { success: false, error: 'Reservation hold expired. Please select a slot again.' };
    }

    booking.status = 'confirmed';
    booking.confirmedAt = new Date().toISOString();

    const tourney = this.getTournament(booking.tournamentId);
    if (tourney) {
      tourney.confirmedSlots = (tourney.confirmedSlots || 0) + 1;
      tourney.filledSlots = Math.max(tourney.filledSlots, tourney.confirmedSlots);
    }

    this.addNotification({
      userId,
      title: 'Registration Confirmed!',
      message: `Slot #${booking.slotNumber} in ${booking.tournamentTitle} is locked for your squad.`,
      type: 'booking_confirmed',
      link: `/dashboard/bookings/${booking.id}`,
    });

    this.persist();
    return { success: true };
  }

  public checkInBooking(bookingId: string, userId: string): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId && b.userId === userId);
    if (!booking) return { success: false, error: 'Booking not found' };

    const tourney = this.getTournament(booking.tournamentId);
    if (!tourney) return { success: false, error: 'Tournament not found' };

    if (tourney.status !== 'check_in' && tourney.status !== 'live') {
      return { success: false, error: 'Check-in window is not currently open for this match' };
    }

    booking.status = 'checked_in';
    booking.checkedInAt = new Date().toISOString();

    this.addNotification({
      userId,
      title: 'Checked In Successfully!',
      message: `You are checked in for ${tourney.title}. Keep your Free Fire app ready.`,
      type: 'match_alert',
      link: `/dashboard/bookings/${booking.id}`,
    });

    this.persist();
    return { success: true };
  }

  public cancelBooking(bookingId: string, actor: UserProfile): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.userId !== actor.uid && actor.role === 'player') {
      return { success: false, error: 'Unauthorized to cancel this booking' };
    }

    booking.status = 'cancelled';
    const tourney = this.getTournament(booking.tournamentId);
    if (tourney && tourney.confirmedSlots > 0) {
      tourney.confirmedSlots = Math.max(0, tourney.confirmedSlots - 1);
      tourney.filledSlots = Math.max(0, tourney.filledSlots - 1);
    }

    this.logAction(actor, 'CANCEL_BOOKING', 'booking', bookingId, `Cancelled booking slot #${booking.slotNumber}`);
    this.persist();
    return { success: true };
  }

  // ----------------------------------------------------
  // CONFIDENTIAL ROOM CREDENTIALS (Secure Isolation)
  // ----------------------------------------------------
  public releaseRoomCredentials(
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    instructions: string,
    actor: UserProfile
  ): { success: boolean; error?: string } {
    if (actor.role === 'player') {
      return { success: false, error: 'Only staff can release custom room credentials' };
    }

    const now = new Date().toISOString();
    this.state.rooms[tournamentId] = {
      tournamentId,
      roomId,
      roomPassword,
      customInstructions: instructions,
      releasedAt: now,
      releasedBy: actor.uid,
      updatedAt: now,
    };

    const tourney = this.getTournament(tournamentId);
    if (tourney) {
      tourney.roomCredentialsReleased = true;
      tourney.updatedAt = now;
    }

    // Broadcast in-app alerts to confirmed players
    const confirmedBookings = this.state.bookings.filter(
      (b) =>
        b.tournamentId === tournamentId &&
        (b.status === 'confirmed' || b.status === 'checked_in')
    );

    confirmedBookings.forEach((b) => {
      this.addNotification({
        userId: b.userId,
        title: 'Room Credentials Released!',
        message: `Custom Room ID: ${roomId} has been released for ${tourney?.title || 'your scrim'}.`,
        type: 'room_released',
        link: `/dashboard/bookings/${b.id}`,
      });
    });

    this.logAction(
      actor,
      'RELEASE_ROOM_CREDENTIALS',
      'tournament_room',
      tournamentId,
      `Released Room ID to ${confirmedBookings.length} participants`
    );

    this.persist();
    return { success: true };
  }

  public getRoomCredentials(
    tournamentId: string,
    actor: UserProfile | null
  ): { authorized: boolean; room?: TournamentRoom; reason?: string } {
    if (!actor) {
      return { authorized: false, reason: 'Authentication required' };
    }

    // Admins and Moderators have immediate operational clearance
    if (actor.role === 'owner' || actor.role === 'moderator') {
      const room = this.state.rooms[tournamentId];
      return { authorized: true, room };
    }

    // Regular players: MUST have a confirmed/checked_in booking AND room credentials must be released
    const tourney = this.getTournament(tournamentId);
    if (!tourney || !tourney.roomCredentialsReleased) {
      return { authorized: false, reason: 'Room details have not been released by the host yet.' };
    }

    const userBooking = this.state.bookings.find(
      (b) =>
        b.tournamentId === tournamentId &&
        b.userId === actor.uid &&
        (b.status === 'confirmed' || b.status === 'checked_in')
    );

    if (!userBooking) {
      return { authorized: false, reason: 'You must have a confirmed registration to view room credentials.' };
    }

    const room = this.state.rooms[tournamentId];
    return { authorized: true, room };
  }

  // ----------------------------------------------------
  // RESULTS & LEADERBOARDS
  // ----------------------------------------------------
  public getTournamentResult(tournamentId: string): TournamentResult | undefined {
    return this.state.results[tournamentId];
  }

  public getAllResults(): TournamentResult[] {
    return Object.values(this.state.results);
  }

  public saveTournamentResults(
    tournamentId: string,
    entries: ResultEntry[],
    isProvisional: boolean,
    actor: UserProfile
  ): { success: boolean; error?: string } {
    if (actor.role === 'player') {
      return { success: false, error: 'Unauthorized to enter match results' };
    }

    const now = new Date().toISOString();
    this.state.results[tournamentId] = {
      tournamentId,
      isProvisional,
      entries,
      publishedAt: now,
      publishedBy: actor.uid,
      updatedAt: now,
    };

    const tourney = this.getTournament(tournamentId);
    if (tourney) {
      tourney.status = isProvisional ? 'provisional_results' : 'finalized';
      tourney.updatedAt = now;

      // When finalized, create prize records for eligible ranks
      if (!isProvisional && tourney.prizeBreakdown && tourney.prizeBreakdown.length > 0) {
        tourney.prizeBreakdown.forEach((prize) => {
          const entry = entries.find((e) => e.rank === prize.rank);
          if (entry && prize.amountInr > 0) {
            // Find user by FF UID or booking
            const booking = this.state.bookings.find(
              (b) => b.tournamentId === tournamentId && (b.playerUid === entry.freeFireUid || b.playerIgn === entry.teamOrPlayerName)
            );
            const winnerUid = booking ? booking.userId : 'unlinked_winner';
            const winnerName = booking ? booking.userDisplayName : entry.teamOrPlayerName;

            const existingPrize = this.state.prizes.find(
              (p) => p.tournamentId === tournamentId && p.rank === prize.rank
            );
            if (!existingPrize) {
              const newPrize: PrizeRecord = {
                id: `prize-${tournamentId}-${prize.rank}-${Date.now()}`,
                userId: winnerUid,
                userDisplayName: winnerName,
                tournamentId: tourney.id,
                tournamentTitle: tourney.title,
                rank: prize.rank,
                amountInr: prize.amountInr,
                status: 'pending_review',
                createdAt: now,
              };
              this.state.prizes.push(newPrize);
            }
          }
        });
      }
    }

    this.logAction(
      actor,
      isProvisional ? 'PUBLISH_PROVISIONAL_RESULTS' : 'FINALIZE_RESULTS',
      'tournament',
      tournamentId,
      `Published ${entries.length} result entries for ${tourney?.title || tournamentId}`
    );

    this.persist();
    return { success: true };
  }

  // ----------------------------------------------------
  // PRIZE SETTLEMENT LEDGER (Read-only history)
  // ----------------------------------------------------
  public getPrizes(userId?: string): PrizeRecord[] {
    if (userId) {
      return this.state.prizes.filter((p) => p.userId === userId);
    }
    return [...this.state.prizes];
  }

  public settlePrize(
    prizeId: string,
    paymentRef: string,
    notes: string,
    actor: UserProfile
  ): { success: boolean; error?: string } {
    if (actor.role !== 'owner') {
      return { success: false, error: 'Only the platform owner can mark prize payouts settled' };
    }

    const prize = this.state.prizes.find((p) => p.id === prizeId);
    if (!prize) return { success: false, error: 'Prize record not found' };

    prize.status = 'settled';
    prize.settledAt = new Date().toISOString();
    prize.manualPaymentReference = paymentRef;
    prize.adminNotes = notes;

    this.addNotification({
      userId: prize.userId,
      title: 'Prize Settlement Processed',
      message: `Your reward of ₹${prize.amountInr} for Rank #${prize.rank} in ${prize.tournamentTitle} has been settled. Ref: ${paymentRef}`,
      type: 'prize_settled',
      link: '/dashboard/wallet',
    });

    this.logAction(
      actor,
      'SETTLE_PRIZE_MANUAL',
      'prize_record',
      prizeId,
      `Settled ₹${prize.amountInr} for ${prize.userDisplayName} (Ref: ${paymentRef})`
    );

    this.persist();
    return { success: true };
  }

  // ----------------------------------------------------
  // TEAMS
  // ----------------------------------------------------
  public getTeams(userUid?: string): Team[] {
    if (userUid) {
      return this.state.teams.filter(
        (t) => t.captainUid === userUid || t.members.some((m) => m.uid === userUid)
      );
    }
    return [...this.state.teams];
  }

  public getTeam(teamId: string): Team | undefined {
    return this.state.teams.find((t) => t.id === teamId);
  }

  public createTeam(name: string, tag: string, captain: UserProfile): Team {
    const team: Team = {
      id: `team-${Date.now()}`,
      name,
      tag: tag.toUpperCase(),
      captainUid: captain.uid,
      captainIgn: captain.freeFireIgn || captain.displayName,
      createdAt: new Date().toISOString(),
      members: [
        {
          uid: captain.uid,
          displayName: captain.displayName,
          freeFireUid: captain.freeFireUid,
          freeFireIgn: captain.freeFireIgn,
          role: 'captain',
          joinedAt: new Date().toISOString(),
        },
      ],
    };
    this.state.teams.push(team);
    this.persist();
    return team;
  }

  public addTeamMember(teamId: string, member: UserProfile): { success: boolean; error?: string } {
    const team = this.getTeam(teamId);
    if (!team) return { success: false, error: 'Team not found' };

    if (team.members.length >= 6) {
      return { success: false, error: 'Team roster full (max 6 players: 4 active + 2 subs)' };
    }

    if (team.members.some((m) => m.uid === member.uid)) {
      return { success: false, error: 'Player already on this roster' };
    }

    team.members.push({
      uid: member.uid,
      displayName: member.displayName,
      freeFireUid: member.freeFireUid,
      freeFireIgn: member.freeFireIgn,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  // ----------------------------------------------------
  // SUPPORT TICKETS & DISPUTES
  // ----------------------------------------------------
  public getTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.state.tickets.filter((t) => t.userId === userId);
    }
    return [...this.state.tickets];
  }

  public getTicket(id: string): SupportTicket | undefined {
    return this.state.tickets.find((t) => t.id === id);
  }

  public createTicket(
    user: UserProfile,
    category: TicketCategory,
    subject: string,
    message: string,
    tournamentId?: string
  ): SupportTicket {
    const now = new Date().toISOString();
    const tourney = tournamentId ? this.getTournament(tournamentId) : undefined;
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: user.uid,
      userDisplayName: user.displayName,
      tournamentId,
      tournamentTitle: tourney?.title,
      category,
      subject,
      status: 'open',
      priority: category === 'match_dispute' ? 'urgent' : 'medium',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: user.uid,
          senderName: user.displayName,
          senderRole: user.role,
          message,
          timestamp: now,
        },
      ],
    };
    this.state.tickets.unshift(ticket);
    this.persist();
    return ticket;
  }

  public replyTicket(ticketId: string, sender: UserProfile, messageText: string): boolean {
    const ticket = this.getTicket(ticketId);
    if (!ticket) return false;

    const now = new Date().toISOString();
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      senderId: sender.uid,
      senderName: sender.displayName,
      senderRole: sender.role,
      message: messageText,
      timestamp: now,
    });
    ticket.updatedAt = now;

    if (sender.role !== 'player' && ticket.status === 'open') {
      ticket.status = 'in_progress';
      ticket.assignedModerator = sender.displayName;
    }

    this.persist();
    return true;
  }

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  public getNotifications(userId: string): InAppNotification[] {
    return this.state.notifications.filter((n) => n.userId === userId);
  }

  public addNotification(notif: Omit<InAppNotification, 'id' | 'read' | 'createdAt'>) {
    this.state.notifications.unshift({
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    this.persist();
  }

  public markNotificationAsRead(id: string) {
    const n = this.state.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
  }

  // ----------------------------------------------------
  // AUDIT LOGS (Append-Only)
  // ----------------------------------------------------
  public getAuditLogs(): AuditLog[] {
    return [...this.state.auditLogs];
  }

  private logAction(
    actor: UserProfile,
    action: string,
    targetType: string,
    targetId: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorUid: actor.uid,
      actorDisplayName: actor.displayName,
      actorRole: actor.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
  }

  // ----------------------------------------------------
  // ANNOUNCEMENTS
  // ----------------------------------------------------
  public getAnnouncements(): Announcement[] {
    return this.state.announcements.filter((a) => a.active);
  }

  public saveAnnouncement(ann: Announcement, actor: UserProfile) {
    const idx = this.state.announcements.findIndex((a) => a.id === ann.id);
    if (idx >= 0) {
      this.state.announcements[idx] = ann;
    } else {
      this.state.announcements.unshift(ann);
    }
    this.logAction(actor, 'UPDATE_ANNOUNCEMENTS', 'announcement', ann.id, `Saved announcement: ${ann.title}`);
    this.persist();
  }
}

export const redlineStore = new RedlineStore();
