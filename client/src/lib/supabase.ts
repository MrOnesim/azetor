import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase env vars manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; pseudo: string; avatar_color: string; is_banned: boolean; banned_until: string | null; is_admin: boolean; created_at: string }
        Insert: { id: string; pseudo: string; avatar_color?: string; is_banned?: boolean; banned_until?: string | null; is_admin?: boolean }
        Update: { pseudo?: string; avatar_color?: string; is_banned?: boolean; banned_until?: string | null }
      }
      albums: {
        Row: { id: number; title: string; cover_url: string; release_year: number; type: string; status: string; created_at: string }
        Insert: { title: string; cover_url?: string; release_year: number; type?: string; status?: string }
        Update: { title?: string; cover_url?: string; release_year?: number; type?: string; status?: string }
      }
      tracks: {
        Row: { id: number; title: string; feat: string; audio_url: string; duration: number; play_count: number; album_id: number; created_at: string }
        Insert: { title: string; feat?: string; audio_url?: string; duration: number; album_id: number }
        Update: { title?: string; feat?: string; audio_url?: string; duration?: number; play_count?: number }
      }
      videos: {
        Row: { id: number; title: string; description: string; youtube_url: string; thumbnail_url: string; category: string; view_count: number; created_at: string }
        Insert: { title: string; description?: string; youtube_url: string; thumbnail_url?: string; category?: string }
        Update: { title?: string; description?: string; youtube_url?: string; thumbnail_url?: string; category?: string }
      }
      events: {
        Row: { id: number; title: string; date: string; venue: string; city: string; country: string; ticket_url: string; status: string; created_at: string }
        Insert: { title: string; date: string; venue: string; city: string; country: string; ticket_url?: string; status?: string }
        Update: { title?: string; date?: string; venue?: string; city?: string; country?: string; ticket_url?: string; status?: string }
      }
      comments: {
        Row: { id: number; user_id: string; video_id: number; content: string; approved: boolean; flag_count: number; created_at: string }
        Insert: { user_id: string; video_id: number; content: string }
        Update: { approved?: boolean; flag_count?: number }
      }
      badges: {
        Row: { id: number; slug: string; name: string; description: string; emoji: string; threshold: number; type: string }
        Insert: { slug: string; name: string; description: string; emoji: string; threshold: number; type: string }
        Update: { name?: string; description?: string; emoji?: string; threshold?: number }
      }
      user_badges: {
        Row: { id: number; user_id: string; badge_id: number; created_at: string }
        Insert: { user_id: string; badge_id: number }
        Update: never
      }
      event_reactions: {
        Row: { id: number; user_id: string; event_id: number; created_at: string }
        Insert: { user_id: string; event_id: number }
        Update: never
      }
      contact_messages: {
        Row: { id: number; name: string; email: string; subject: string; message: string; created_at: string }
        Insert: { name: string; email: string; subject: string; message: string }
        Update: never
      }
    }
  }
}
