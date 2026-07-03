export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          sort_order?: number | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          category_id: string | null
          short_description: string | null
          long_description: string | null
          price: number
          compare_at_price: number | null
          currency: string | null
          thumbnail_url: string | null
          status: string | null
          level: string | null
          language: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category_id?: string | null
          short_description?: string | null
          long_description?: string | null
          price?: number
          compare_at_price?: number | null
          currency?: string | null
          thumbnail_url?: string | null
          status?: string | null
          level?: string | null
          language?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category_id?: string | null
          short_description?: string | null
          long_description?: string | null
          price?: number
          compare_at_price?: number | null
          currency?: string | null
          thumbnail_url?: string | null
          status?: string | null
          level?: string | null
          language?: string | null
          created_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string | null
          title: string
          sort_order: number | null
        }
        Insert: {
          id?: string
          course_id?: string | null
          title: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string
          sort_order?: number | null
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string | null
          title: string
          youtube_video_id: string
          duration_seconds: number | null
          is_preview: boolean | null
          sort_order: number | null
          material_url: string | null
          material_title: string | null
        }
        Insert: {
          id?: string
          module_id?: string | null
          title: string
          youtube_video_id: string
          duration_seconds?: number | null
          is_preview?: boolean | null
          sort_order?: number | null
          material_url?: string | null
          material_title?: string | null
        }
        Update: {
          id?: string
          module_id?: string | null
          title?: string
          youtube_video_id?: string
          duration_seconds?: number | null
          is_preview?: boolean | null
          sort_order?: number | null
          material_url?: string | null
          material_title?: string | null
        }
      }
    }
  }
}
