import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://apzcrfmjntztcyntcmoj.supabase.co';
const supabaseAnonKey = 'sb_publishable_Kkdj4LELnxY7G0vv_q699A_rqww3I7R';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);