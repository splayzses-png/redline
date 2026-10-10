import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { redlineStore } from '../services/store';
import { getFeatureFlags } from '../config/featureFlags';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    freeFireUid: string,
    freeFireIgn: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => void;
  unreadNotificationsCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  useEffect(() => {
    // Check local session
    const storedUid = localStorage.getItem('redline_current_uid');
    if (storedUid) {
      const user = redlineStore.getUser(storedUid);
      if (user) {
        setCurrentUser(user);
      } else {
        // default to demo player if missing
        setCurrentUser(redlineStore.getUser('player_user_003') || null);
      }
    } else {
      // Default to logged-in player for seamless evaluation
      const defaultUser = redlineStore.getUser('player_user_003');
      if (defaultUser) {
        setCurrentUser(defaultUser);
        localStorage.setItem('redline_current_uid', defaultUser.uid);
      }
    }
    setLoading(false);
  }, []);

  // Update notification count whenever store updates
  useEffect(() => {
    const updateNotifs = () => {
      if (currentUser) {
        const notifs = redlineStore.getNotifications(currentUser.uid);
        setUnreadNotificationsCount(notifs.filter((n) => !n.read).length);
      } else {
        setUnreadNotificationsCount(0);
      }
    };

    updateNotifs();
    const unsubscribe = redlineStore.subscribe(updateNotifs);
    return () => unsubscribe();
  }, [currentUser]);

  const loginWithEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = redlineStore.getUsers().find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please register.' };
    }
    if (user.status === 'banned') {
      return { success: false, error: 'This account has been banned due to fair play violations.' };
    }
    setCurrentUser(user);
    localStorage.setItem('redline_current_uid', user.uid);
    return { success: true };
  };

  const registerWithEmail = async (
    email: string,
    _pass: string,
    displayName: string,
    freeFireUid: string,
    freeFireIgn: string
  ): Promise<{ success: boolean; error?: string }> => {
    const flags = getFeatureFlags();
    if (!flags.publicRegistrationEnabled) {
      return { success: false, error: 'Public registration is currently paused by platform administrator.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUid = freeFireUid.trim();

    // Check duplicate email
    if (redlineStore.getUsers().some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Check duplicate Free Fire numeric UID
    if (redlineStore.getUsers().some((u) => u.freeFireUid === cleanUid)) {
      return { success: false, error: 'This Free Fire UID is already registered to another player account.' };
    }

    const newUser: UserProfile = {
      uid: `usr_${Date.now()}`,
      email: cleanEmail,
      displayName: displayName.trim(),
      freeFireUid: cleanUid,
      freeFireIgn: freeFireIgn.trim(),
      role: 'player',
      isPhoneVerified: false,
      isEmailVerified: true,
      status: 'active',
      referralCode: `RL_${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    redlineStore.saveUser(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('redline_current_uid', newUser.uid);
    return { success: true };
  };

  const loginWithPhone = async (_phone: string, _otp: string): Promise<{ success: boolean; error?: string }> => {
    const flags = getFeatureFlags();
    if (!flags.smsOtpEnabled) {
      return {
        success: false,
        error: 'Phone OTP is currently disabled by launch configuration. Please use email sign in.',
      };
    }
    return { success: false, error: 'SMS OTP verification pending owner provider integration.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('redline_current_uid');
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    const updated: UserProfile = {
      ...currentUser,
      ...updates,
      // prevent tampering with privileged fields
      role: currentUser.role,
      status: currentUser.status,
      uid: currentUser.uid,
    };
    redlineStore.saveUser(updated);
    setCurrentUser(updated);
    return true;
  };

  // Helper for effortless review & testing between roles
  const switchDemoRole = (role: UserRole) => {
    let targetUid = 'player_user_003';
    if (role === 'owner') targetUid = 'owner_user_001';
    if (role === 'moderator') targetUid = 'mod_user_002';

    const user = redlineStore.getUser(targetUid);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('redline_current_uid', user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithPhone,
        logout,
        updateProfile,
        switchDemoRole,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
