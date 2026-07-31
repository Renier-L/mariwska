import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://macnchksowbneytrxdjp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ns5pSHjV7CdRXKtJ1sKaPA_nnT44knN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
