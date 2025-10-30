import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          email: string;
          role: 'visitor' | 'student' | 'researcher' | 'admin';
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          email: string;
          role?: 'visitor' | 'student' | 'researcher' | 'admin';
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
        };
        Update: {
          username?: string;
          full_name?: string;
          email?: string;
          role?: 'visitor' | 'student' | 'researcher' | 'admin';
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
        };
      };
    };
  };
};
