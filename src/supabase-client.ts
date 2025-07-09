import { createClient } from '@supabase/supabase-js'

const apiKey = import.meta.env.VITE_API_KEY;
const anonId = import.meta.env.VITE_ANON_ID;

export const supabase = createClient(apiKey,anonId);