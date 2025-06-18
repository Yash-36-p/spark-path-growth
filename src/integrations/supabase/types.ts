export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          categories: string[] | null
          created_at: string | null
          current_mood: number | null
          difficulty_level: string | null
          goals: string[] | null
          id: string
          name: string
          personality_type: string | null
          quest_frequency: string | null
          spark_points: number | null
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          current_mood?: number | null
          difficulty_level?: string | null
          goals?: string[] | null
          id: string
          name: string
          personality_type?: string | null
          quest_frequency?: string | null
          spark_points?: number | null
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          current_mood?: number | null
          difficulty_level?: string | null
          goals?: string[] | null
          id?: string
          name?: string
          personality_type?: string | null
          quest_frequency?: string | null
          spark_points?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quests: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string | null
          estimated_time: string
          id: string
          instructions: string[]
          personality_match: string[] | null
          points_reward: number
          reflection_prompts: string[] | null
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty?: string | null
          estimated_time: string
          id?: string
          instructions: string[]
          personality_match?: string[] | null
          points_reward: number
          reflection_prompts?: string[] | null
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string | null
          estimated_time?: string
          id?: string
          instructions?: string[]
          personality_match?: string[] | null
          points_reward?: number
          reflection_prompts?: string[] | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          insights: string | null
          mood: number | null
          quest_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          insights?: string | null
          mood?: number | null
          quest_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          insights?: string | null
          mood?: number | null
          quest_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          available: boolean | null
          category: string | null
          cost: number
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          available?: boolean | null
          category?: string | null
          cost: number
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          available?: boolean | null
          category?: string | null
          cost?: number
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_quests: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          id: string
          insights: string | null
          quest_id: string
          reflection_mood: number | null
          reflection_text: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          id?: string
          insights?: string | null
          quest_id: string
          reflection_mood?: number | null
          reflection_text?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          id?: string
          insights?: string | null
          quest_id?: string
          reflection_mood?: number | null
          reflection_text?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          id: string
          purchased_at: string | null
          reward_id: string
          user_id: string
        }
        Insert: {
          id?: string
          purchased_at?: string | null
          reward_id: string
          user_id: string
        }
        Update: {
          id?: string
          purchased_at?: string | null
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
