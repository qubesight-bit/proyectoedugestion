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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admission_requests: {
        Row: {
          admin_note: string
          birth_date: string
          created_at: string
          desired_level: string
          entry_type: string
          guardian_document: string
          guardian_email: string
          guardian_name: string
          guardian_phone: string
          id: string
          status: string
          student_document: string
          student_name: string
          updated_at: string
        }
        Insert: {
          admin_note?: string
          birth_date: string
          created_at?: string
          desired_level: string
          entry_type?: string
          guardian_document: string
          guardian_email: string
          guardian_name: string
          guardian_phone: string
          id?: string
          status?: string
          student_document: string
          student_name: string
          updated_at?: string
        }
        Update: {
          admin_note?: string
          birth_date?: string
          created_at?: string
          desired_level?: string
          entry_type?: string
          guardian_document?: string
          guardian_email?: string
          guardian_name?: string
          guardian_phone?: string
          id?: string
          status?: string
          student_document?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_name: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          source?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_students: {
        Row: {
          course_id: string
          enrolled_at: string
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          capacity: number
          category: string
          created_at: string
          created_by: string | null
          enrolled: number
          face: string
          id: string
          level: string
          note: string
          room: string
          schedule: string
          tag: string
          teacher: string
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          category?: string
          created_at?: string
          created_by?: string | null
          enrolled?: number
          face?: string
          id?: string
          level?: string
          note?: string
          room?: string
          schedule?: string
          tag?: string
          teacher?: string
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          category?: string
          created_at?: string
          created_by?: string | null
          enrolled?: number
          face?: string
          id?: string
          level?: string
          note?: string
          room?: string
          schedule?: string
          tag?: string
          teacher?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          alert: string
          code: string
          created_at: string
          created_by: string | null
          email: string
          grade: string
          id: string
          image: string
          name: string
          phone: string
          score: number | null
          status: string
          tutor: string
          updated_at: string
        }
        Insert: {
          alert?: string
          code?: string
          created_at?: string
          created_by?: string | null
          email?: string
          grade?: string
          id?: string
          image?: string
          name: string
          phone?: string
          score?: number | null
          status?: string
          tutor?: string
          updated_at?: string
        }
        Update: {
          alert?: string
          code?: string
          created_at?: string
          created_by?: string | null
          email?: string
          grade?: string
          id?: string
          image?: string
          name?: string
          phone?: string
          score?: number | null
          status?: string
          tutor?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_grades: {
        Row: {
          course_id: string
          created_at: string
          grade: number
          id: string
          notes: string
          period: string
          recorded_by: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          grade: number
          id?: string
          notes?: string
          period?: string
          recorded_by?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          grade?: number
          id?: string
          notes?: string
          period?: string
          recorded_by?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          bio: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          specialty: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string
          created_at?: string
          email?: string
          full_name: string
          id?: string
          phone?: string
          specialty?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          specialty?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      submit_admission_request: {
        Args: {
          p_birth_date: string
          p_desired_level: string
          p_entry_type: string
          p_guardian_document: string
          p_guardian_email: string
          p_guardian_name: string
          p_guardian_phone: string
          p_student_document: string
          p_student_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "docente" | "estudiante"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "docente", "estudiante"],
    },
  },
} as const
