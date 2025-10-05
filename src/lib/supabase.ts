import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

export type Website = {
  id: string;
  user_id: string;
  url: string;
  title?: string;
  created_at: string;
  updated_at: string;
  latestAnalysis?: Analysis;
  totalAnalyses?: number;
};

export type Analysis = {
  id: string;
  website_id: string;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  security_score: number;
  overall_score: number;
  performance_details: Record<string, any>;
  seo_details: Record<string, any>;
  accessibility_details: Record<string, any>;
  security_details: Record<string, any>;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  website_id?: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
  websites?: {
    url: string;
    title?: string;
  };
};