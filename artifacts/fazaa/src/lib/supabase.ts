import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(url, key);

// ── helpers ──────────────────────────────────────────────────────────────────

export interface RegPayload {
  fullName: string;
  phone: string;
  emiratesId: string;
  brand: string;
  cardType: string;
  region: string;
  streetAddress: string;
  neighborhood: string;
  deliveryDate: string;
  paymentMethod: string;
}

/** Insert a new registration and return its id */
export async function createRegistration(p: RegPayload): Promise<number> {
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      full_name:      p.fullName,
      phone:          p.phone,
      emirates_id:    p.emiratesId,
      brand:          p.brand,
      card_type:      p.cardType,
      region:         p.region,
      street_address: p.streetAddress,
      neighborhood:   p.neighborhood,
      delivery_date:  p.deliveryDate,
      payment_method: p.paymentMethod,
      status:         'pending',
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return (data as any).id;
}

/** Approve a registration immediately */
export async function approveRegistration(id: number): Promise<void> {
  await supabase
    .from('registrations')
    .update({ status: 'approved' })
    .eq('id', id);
}

/** Fetch a single registration by id */
export async function getRegistration(id: number) {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, full_name, phone, emirates_id, brand, card_type, region, street_address, neighborhood, delivery_date, payment_method, status, created_at')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  const r = data as any;
  return {
    id:            r.id,
    fullName:      r.full_name,
    phone:         r.phone,
    emiratesId:    r.emirates_id,
    brand:         r.brand,
    cardType:      r.card_type,
    region:        r.region,
    streetAddress: r.street_address,
    neighborhood:  r.neighborhood,
    deliveryDate:  r.delivery_date,
    paymentMethod: r.payment_method,
    status:        r.status as 'pending' | 'approved' | 'rejected',
    createdAt:     r.created_at,
  };
}
