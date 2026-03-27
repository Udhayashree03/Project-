export type SupportedApp = 'Ola' | 'Uber' | 'Rapido' | 'Namma Yatri';

export interface Order {
  id: string;
  sourceApp: SupportedApp;
  pickupDistance: number; // in km
  fare: number; // in local currency
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

export interface AppSettings {
  minFare: number;
  maxFare: number;
  maxDistance: number;
  autoAcceptEnabled: boolean;
  timeDurationMs: number;
  swipeDurationMs: number;
  activeApps: Record<SupportedApp, boolean>;
}
