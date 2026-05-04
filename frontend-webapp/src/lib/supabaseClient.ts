import { createClient } from '@supabase/supabase-js';

// Valores de fallback solo para que no crashee durante inicialización.
// En un entorno real deben venir desde tu archivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cole-ohiggins.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
