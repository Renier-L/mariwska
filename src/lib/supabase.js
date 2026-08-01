import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://macnchksowbneytrxdjp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ns5pSHjV7CdRXKtJ1sKaPA_nnT44knN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
