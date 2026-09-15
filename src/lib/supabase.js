import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const TENANT_ID = import.meta.env.VITE_TENANT_ID || 'misis-siomai';

// Target isolated 'cms' schema to protect other projects sharing the same database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'cms' }
});


