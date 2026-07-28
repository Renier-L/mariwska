import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://macnchksowbneytrxdjp.supabase.co';
const supabaseAnonKey = 'sb_publishable_ns5pSHjV7CdRXKtJ1sKaPA_nnT44knN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
