// ============================================================
// YASS.DOLLS — Supabase configuration
// ------------------------------------------------------------
// 1. Go to your Supabase project → Settings → API
// 2. Copy the "Project URL" and the "anon public" key
// 3. Paste them below (it's safe to expose the anon key in
//    front-end code — that's what it's designed for, as long
//    as Row Level Security policies are in place, which the
//    supabase_seed.sql script already sets up for you).
// ============================================================

const SUPABASE_URL = 'https://olcwacyczdvjuxtiytdc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mwuO9eNph25VbnPXrfT_Ig_CN6FR5Iu';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
