import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string;
          name: string;
          icon: string;
          wattage: number;
          standby_wattage: number;
          status: 'off' | 'standby' | 'on';
          category: string;
          room_id: string;
          has_standby: boolean;
          tips: string[];
          description: string;
          cost_per_hour: number;
          energy_efficiency_rating: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          wattage?: number;
          standby_wattage?: number;
          status?: 'off' | 'standby' | 'on';
          category: string;
          room_id: string;
          has_standby?: boolean;
          tips?: string[];
          description?: string;
          cost_per_hour?: number;
          energy_efficiency_rating?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          wattage?: number;
          standby_wattage?: number;
          status?: 'off' | 'standby' | 'on';
          category?: string;
          room_id?: string;
          has_standby?: boolean;
          tips?: string[];
          description?: string;
          cost_per_hour?: number;
          energy_efficiency_rating?: string;
        };
      };
    };
  };
};