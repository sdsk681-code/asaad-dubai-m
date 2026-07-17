import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set.");
}

export const supabase = createClient(url, key);

export type Registration = {
  id: number;
  full_name: string;
  phone: string;
  emirates_id: string;
  brand: string;
  card_type: string;
  region: string;
  street_address: string;
  neighborhood: string;
  delivery_date: string;
  payment_method: string;
  status: string;
  created_at: string;
};
