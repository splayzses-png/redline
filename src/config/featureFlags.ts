/**
 * REDLINE PAID SCRIMS — Launch Feature Flags
 *
 * All flags strictly default to safe, low-cost constraints.
 * Paid features and third-party SMS/WhatsApp are disabled by default.
 */

export interface FeatureFlags {
  freeTournamentsEnabled: boolean;
  paidTournamentsEnabled: boolean;
  paymentsEnabled: boolean;
  cashWalletEnabled: boolean;
  automatedPayoutsEnabled: boolean;
  smsOtpEnabled: boolean;
  whatsappNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  referralsEnabled: boolean;
  publicRegistrationEnabled: boolean;
}

const getEnvBool = (key: string, defaultValue: boolean): boolean => {
  const val = import.meta.env[key];
  if (val === undefined || val === '') return defaultValue;
  return val === 'true' || val === '1';
};

// Initial state loaded from env or safe defaults
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  freeTournamentsEnabled: getEnvBool('VITE_FREE_TOURNAMENTS_ENABLED', true),
  paidTournamentsEnabled: getEnvBool('VITE_PAID_TOURNAMENTS_ENABLED', false),
  paymentsEnabled: getEnvBool('VITE_PAYMENTS_ENABLED', false),
  cashWalletEnabled: getEnvBool('VITE_CASH_WALLET_ENABLED', false),
  automatedPayoutsEnabled: getEnvBool('VITE_AUTOMATED_PAYOUTS_ENABLED', false),
  smsOtpEnabled: getEnvBool('VITE_SMS_OTP_ENABLED', false),
  whatsappNotificationsEnabled: getEnvBool('VITE_WHATSAPP_NOTIFICATIONS_ENABLED', false),
  smsNotificationsEnabled: getEnvBool('VITE_SMS_NOTIFICATIONS_ENABLED', false),
  inAppNotificationsEnabled: getEnvBool('VITE_IN_APP_NOTIFICATIONS_ENABLED', true),
  referralsEnabled: getEnvBool('VITE_REFERRALS_ENABLED', true),
  publicRegistrationEnabled: getEnvBool('VITE_PUBLIC_REGISTRATION_ENABLED', true),
};

// Live feature flags state with local persistence for owner testing in admin settings
let currentFlags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

try {
  const stored = localStorage.getItem('redline_feature_flags');
  if (stored) {
    currentFlags = { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) };
  }
} catch {
  // fallback to defaults
}

export const getFeatureFlags = (): FeatureFlags => ({ ...currentFlags });

export const updateFeatureFlag = <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void => {
  currentFlags[key] = value;
  try {
    localStorage.setItem('redline_feature_flags', JSON.stringify(currentFlags));
  } catch {
    // ignore storage error
  }
};
