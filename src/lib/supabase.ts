import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// For server-side API routes: prefer the service role key (bypasses RLS)
// For client-side usage: fall back to the anon key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseKey = serviceRoleKey || anonKey;

// Create a client only if both URL and Key are provided
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            // Disable auto-refresh for server-side usage
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

if (!supabase) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('[Supabase] Client NOT initialized. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in deployment environment variables.');
    } else {
        console.info('[Supabase] Client not initialized (Dev mode). Using local JSON fallback.');
    }
} else {
    const keyType = serviceRoleKey ? 'SERVICE_ROLE (RLS bypassed)' : 'ANON (RLS active)';
    console.log(`[Supabase] Client initialized with ${keyType} key.`);
}
