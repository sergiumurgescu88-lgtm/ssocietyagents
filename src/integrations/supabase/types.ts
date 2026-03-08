export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_conversations: {
        Row: {
          agent_id: string
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "project_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_logs: {
        Row: {
          action_type: string
          agent_id: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          agent_id: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          agent_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "project_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          category: string
          earned_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          earned_at?: string
          id?: string
          title?: string
          user_id: string
        }
        Update: {
          category?: string
          earned_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          action_items: string[] | null
          category: string
          content: Json
          created_at: string
          description: string
          difficulty: string
          estimated_minutes: number
          id: string
          key_takeaways: string[] | null
          lessons_count: number
          resources: Json | null
          sort_order: number
          title: string
          xp_reward: number
        }
        Insert: {
          action_items?: string[] | null
          category?: string
          content?: Json
          created_at?: string
          description?: string
          difficulty?: string
          estimated_minutes?: number
          id?: string
          key_takeaways?: string[] | null
          lessons_count?: number
          resources?: Json | null
          sort_order?: number
          title: string
          xp_reward?: number
        }
        Update: {
          action_items?: string[] | null
          category?: string
          content?: Json
          created_at?: string
          description?: string
          difficulty?: string
          estimated_minutes?: number
          id?: string
          key_takeaways?: string[] | null
          lessons_count?: number
          resources?: Json | null
          sort_order?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          project_id: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          project_id: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          project_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          agent_updates: boolean
          created_at: string
          daily_digest_enabled: boolean
          daily_digest_time: string
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          learning_reminders: boolean
          opportunity_alerts: boolean
          project_alerts: boolean
          push_enabled: boolean
          revenue_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_updates?: boolean
          created_at?: string
          daily_digest_enabled?: boolean
          daily_digest_time?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          learning_reminders?: boolean
          opportunity_alerts?: boolean
          project_alerts?: boolean
          push_enabled?: boolean
          revenue_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_updates?: boolean
          created_at?: string
          daily_digest_enabled?: boolean
          daily_digest_time?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          learning_reminders?: boolean
          opportunity_alerts?: boolean
          project_alerts?: boolean
          push_enabled?: boolean
          revenue_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          category: string
          created_at: string
          description: string
          effort_level: string
          estimated_revenue_max: number | null
          estimated_revenue_min: number | null
          expires_at: string | null
          id: string
          is_new: boolean | null
          profit_score: number
          sources: Json | null
          tags: string[] | null
          title: string
          trend: string | null
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          effort_level?: string
          estimated_revenue_max?: number | null
          estimated_revenue_min?: number | null
          expires_at?: string | null
          id?: string
          is_new?: boolean | null
          profit_score?: number
          sources?: Json | null
          tags?: string[] | null
          title: string
          trend?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          effort_level?: string
          estimated_revenue_max?: number | null
          estimated_revenue_min?: number | null
          expires_at?: string | null
          id?: string
          is_new?: boolean | null
          profit_score?: number
          sources?: Json | null
          tags?: string[] | null
          title?: string
          trend?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          skills: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_agents: {
        Row: {
          assigned_at: string
          created_at: string
          id: string
          name: string
          performance_score: number | null
          project_id: string
          role: Database["public"]["Enums"]["agent_role"]
          status: string
          system_prompt: string | null
          tasks_completed: number | null
          tasks_total: number | null
          user_id: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          id?: string
          name: string
          performance_score?: number | null
          project_id: string
          role: Database["public"]["Enums"]["agent_role"]
          status?: string
          system_prompt?: string | null
          tasks_completed?: number | null
          tasks_total?: number | null
          user_id: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          id?: string
          name?: string
          performance_score?: number | null
          project_id?: string
          role?: Database["public"]["Enums"]["agent_role"]
          status?: string
          system_prompt?: string | null
          tasks_completed?: number | null
          tasks_total?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_agents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_hours: number | null
          budget_money: number | null
          category: Database["public"]["Enums"]["project_category"]
          created_at: string
          current_revenue: number | null
          deadline: string | null
          description: string | null
          id: string
          progress: number | null
          revenue_target: number | null
          status: Database["public"]["Enums"]["project_status"]
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_hours?: number | null
          budget_money?: number | null
          category?: Database["public"]["Enums"]["project_category"]
          created_at?: string
          current_revenue?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          revenue_target?: number | null
          status?: Database["public"]["Enums"]["project_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_hours?: number | null
          budget_money?: number | null
          category?: Database["public"]["Enums"]["project_category"]
          created_at?: string
          current_revenue?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          revenue_target?: number | null
          status?: Database["public"]["Enums"]["project_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          module_id: string
          passing_score: number
          questions: Json
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          passing_score?: number
          questions?: Json
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          passing_score?: number
          questions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          date: string
          description: string | null
          id: string
          project_id: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          project_id?: string | null
          source?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          project_id?: string | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_logs: {
        Row: {
          duration_ms: number | null
          id: string
          opportunities_found: number | null
          scan_date: string
          sources_used: string[] | null
          user_id: string
        }
        Insert: {
          duration_ms?: number | null
          id?: string
          opportunities_found?: number | null
          scan_date?: string
          sources_used?: string[] | null
          user_id: string
        }
        Update: {
          duration_ms?: number | null
          id?: string
          opportunities_found?: number | null
          scan_date?: string
          sources_used?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "project_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          agents_count: number
          api_calls: number
          created_at: string
          date: string
          id: string
          projects_count: number
          revenue_generated: number
          user_id: string
        }
        Insert: {
          agents_count?: number
          api_calls?: number
          created_at?: string
          date?: string
          id?: string
          projects_count?: number
          revenue_generated?: number
          user_id: string
        }
        Update: {
          agents_count?: number
          api_calls?: number
          created_at?: string
          date?: string
          id?: string
          projects_count?: number
          revenue_generated?: number
          user_id?: string
        }
        Relationships: []
      }
      user_modules: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          progress: number
          quiz_score: number | null
          status: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          progress?: number
          quiz_score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          progress?: number
          quiz_score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          rated_score: number | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          rated_score?: number | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          rated_score?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quizzes: {
        Row: {
          answers: Json
          id: string
          passed: boolean
          quiz_id: string
          score: number
          taken_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          taken_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quizzes_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
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
      agent_role:
        | "project_manager"
        | "developer"
        | "marketer"
        | "sales"
        | "researcher"
        | "analyst"
      plan_type: "free" | "pro" | "agency"
      project_category:
        | "ecommerce"
        | "saas"
        | "content"
        | "affiliate"
        | "consulting"
        | "other"
      project_status: "active" | "paused" | "completed" | "blocked" | "archived"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_role: [
        "project_manager",
        "developer",
        "marketer",
        "sales",
        "researcher",
        "analyst",
      ],
      plan_type: ["free", "pro", "agency"],
      project_category: [
        "ecommerce",
        "saas",
        "content",
        "affiliate",
        "consulting",
        "other",
      ],
      project_status: ["active", "paused", "completed", "blocked", "archived"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done", "blocked"],
    },
  },
} as const
