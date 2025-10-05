import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (adjust path if needed)
dotenv.config(); // loads .env from current folder
// dotenv.config({ path: '../.env' }); // optional: loads parent folder .env

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rhnlhscpphvqopnnjamm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in your environment variables.');
  process.exit(1);  // Stop execution if key missing
}

let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.warn('⚠️ Supabase client initialization failed:', error.message);
  supabase = null;
}

export { supabase };
