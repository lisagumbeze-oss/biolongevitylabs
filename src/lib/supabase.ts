import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a client only if both URL and Key are provided
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('Supabase client is not initialized. Integration will be disabled.');
    } else {
        console.info('Supabase client not initialized (Development mode). Falling back to local data.');
    }
}
