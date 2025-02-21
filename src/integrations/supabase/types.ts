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
      cache_control: {
        Row: {
          cache_key: string
          id: string
          invalidation_time: string
          last_updated: string
        }
        Insert: {
          cache_key: string
          id?: string
          invalidation_time?: string
          last_updated?: string
        }
        Update: {
          cache_key?: string
          id?: string
          invalidation_time?: string
          last_updated?: string
        }
        Relationships: []
      }
      client_preferences: {
        Row: {
          created_at: string
          id: string
          max_price: number | null
          min_price: number | null
          preferred_property_types: string[] | null
          preferred_viewing_times: string[] | null
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          preferred_property_types?: string[] | null
          preferred_viewing_times?: string[] | null
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          preferred_property_types?: string[] | null
          preferred_viewing_times?: string[] | null
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          agent_id: string | null
          amount: number
          client_id: string | null
          created_at: string | null
          expected_close_date: string | null
          id: string
          last_activity_date: string | null
          notes: string | null
          property_address: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          amount: number
          client_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          notes?: string | null
          property_address?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          amount?: number
          client_id?: string | null
          created_at?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          notes?: string | null
          property_address?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis: {
        Row: {
          analysis_type: string
          created_at: string
          document_id: string
          extracted_info: Json | null
          id: string
          summary: string | null
        }
        Insert: {
          analysis_type: string
          created_at?: string
          document_id: string
          extracted_info?: Json | null
          id?: string
          summary?: string | null
        }
        Update: {
          analysis_type?: string
          created_at?: string
          document_id?: string
          extracted_info?: Json | null
          id?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analysis_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content_type: string | null
          created_at: string
          file_path: string
          filename: string
          id: string
          profile_id: string | null
          size: number | null
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_path: string
          filename: string
          id?: string
          profile_id?: string | null
          size?: number | null
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_path?: string
          filename?: string
          id?: string
          profile_id?: string | null
          size?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stage_clients: {
        Row: {
          clientname: string
          completionstatus: string
          created_at: string
          duedate: string
          expense: number
          id: string
          notes: string | null
          stage_id: string
          updated_at: string
        }
        Insert: {
          clientname: string
          completionstatus?: string
          created_at?: string
          duedate: string
          expense?: number
          id?: string
          notes?: string | null
          stage_id: string
          updated_at?: string
        }
        Update: {
          clientname?: string
          completionstatus?: string
          created_at?: string
          duedate?: string
          expense?: number
          id?: string
          notes?: string | null
          stage_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      viewing_appointments: {
        Row: {
          address: string | null
          created_at: string
          id: string
          profile_id: string | null
          updated_at: string
          viewing_date: string
          viewing_time: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
          viewing_date: string
          viewing_time: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
          viewing_date?: string
          viewing_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_appointments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      deal_status_stats: {
        Row: {
          count: number | null
          status: string | null
          total_amount: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      clean_past_appointments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      invalidate_cache: {
        Args: {
          key: string
        }
        Returns: undefined
      }
    }
    Enums: {
      deal_status:
        | "INITIAL_CONTACT"
        | "VIEWING_SCHEDULED"
        | "OFFER_MADE"
        | "NEGOTIATION"
        | "AGREEMENT_PENDING"
        | "CONTRACT_SIGNED"
        | "CLOSED_WON"
        | "CLOSED_LOST"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
