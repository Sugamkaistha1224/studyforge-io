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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_type: string
          created_at: string
          description: string | null
          id: string
          target_id: string | null
          target_type: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description?: string | null
          id?: string
          target_id?: string | null
          target_type: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string | null
          id?: string
          target_id?: string | null
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analysis_history: {
        Row: {
          accuracy_score: number | null
          ai_analysis: Json
          analysis_type: string
          brief_insight: string | null
          created_at: string
          detailed_insight: string | null
          emergency_triggered: boolean | null
          id: string
          input_data: Json
          risk_level: string
          user_id: string | null
          user_location: Json | null
        }
        Insert: {
          accuracy_score?: number | null
          ai_analysis: Json
          analysis_type: string
          brief_insight?: string | null
          created_at?: string
          detailed_insight?: string | null
          emergency_triggered?: boolean | null
          id?: string
          input_data: Json
          risk_level?: string
          user_id?: string | null
          user_location?: Json | null
        }
        Update: {
          accuracy_score?: number | null
          ai_analysis?: Json
          analysis_type?: string
          brief_insight?: string | null
          created_at?: string
          detailed_insight?: string | null
          emergency_triggered?: boolean | null
          id?: string
          input_data?: Json
          risk_level?: string
          user_id?: string | null
          user_location?: Json | null
        }
        Relationships: []
      }
      app_analytics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value?: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      bills: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number | null
          created_at: string
          extracted_data: Json | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          processing_status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          processing_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          processing_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          bill_id: string | null
          created_at: string
          id: string
          message: string
          response: string | null
          user_id: string | null
        }
        Insert: {
          bill_id?: string | null
          created_at?: string
          id?: string
          message: string
          response?: string | null
          user_id?: string | null
        }
        Update: {
          bill_id?: string | null
          created_at?: string
          id?: string
          message?: string
          response?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          file_url: string
          id: string
          type: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          file_url: string
          id?: string
          type: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          file_url?: string
          id?: string
          type?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exam_monitor_logs: {
        Row: {
          captured_at: string
          exam_id: string
          id: string
          image_url: string
          student_id: string
        }
        Insert: {
          captured_at?: string
          exam_id: string
          id?: string
          image_url: string
          student_id: string
        }
        Update: {
          captured_at?: string
          exam_id?: string
          id?: string
          image_url?: string
          student_id?: string
        }
        Relationships: []
      }
      exam_results: {
        Row: {
          answers: number[]
          exam_id: string
          id: string
          rank: number | null
          score: number
          student_id: string
          submitted_at: string
          time_spent: number
        }
        Insert: {
          answers: number[]
          exam_id: string
          id?: string
          rank?: number | null
          score: number
          student_id: string
          submitted_at?: string
          time_spent: number
        }
        Update: {
          answers?: number[]
          exam_id?: string
          id?: string
          rank?: number | null
          score?: number
          student_id?: string
          submitted_at?: string
          time_spent?: number
        }
        Relationships: []
      }
      exams: {
        Row: {
          assigned_teachers: string[] | null
          created_at: string
          created_by: string
          date: string
          duration_minutes: number
          exam_id: string
          id: string
          location: string | null
          marks_per_question: number
          name: string
          negative_marking: number
          series_enabled: boolean
          status: string
          subject: string | null
          time: string
          total_questions: number
        }
        Insert: {
          assigned_teachers?: string[] | null
          created_at?: string
          created_by: string
          date: string
          duration_minutes: number
          exam_id: string
          id?: string
          location?: string | null
          marks_per_question?: number
          name: string
          negative_marking?: number
          series_enabled?: boolean
          status?: string
          subject?: string | null
          time: string
          total_questions: number
        }
        Update: {
          assigned_teachers?: string[] | null
          created_at?: string
          created_by?: string
          date?: string
          duration_minutes?: number
          exam_id?: string
          id?: string
          location?: string | null
          marks_per_question?: number
          name?: string
          negative_marking?: number
          series_enabled?: boolean
          status?: string
          subject?: string | null
          time?: string
          total_questions?: number
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_chats: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          group_id: string
          id: string
          message_type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          group_id: string
          id?: string
          message_type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          group_id?: string
          id?: string
          message_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      health_insights: {
        Row: {
          action_required: boolean | null
          ai_generated: boolean | null
          category: string
          confidence_score: number | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          is_read: boolean | null
          related_metrics_ids: string[] | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_required?: boolean | null
          ai_generated?: boolean | null
          category: string
          confidence_score?: number | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_read?: boolean | null
          related_metrics_ids?: string[] | null
          severity?: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_required?: boolean | null
          ai_generated?: boolean | null
          category?: string
          confidence_score?: number | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_read?: boolean | null
          related_metrics_ids?: string[] | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string
          device_source: string | null
          diastolic: number | null
          id: string
          metric_type: string
          notes: string | null
          recorded_at: string
          systolic: number | null
          unit: string
          user_id: string | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          device_source?: string | null
          diastolic?: number | null
          id?: string
          metric_type: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          unit: string
          user_id?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          device_source?: string | null
          diastolic?: number | null
          id?: string
          metric_type?: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          unit?: string
          user_id?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: []
      }
      health_predictions: {
        Row: {
          ai_model_version: string | null
          based_on_metrics: string[] | null
          confidence_level: number | null
          created_at: string
          id: string
          prediction_data: Json
          prediction_type: string
          time_horizon: string
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          ai_model_version?: string | null
          based_on_metrics?: string[] | null
          confidence_level?: number | null
          created_at?: string
          id?: string
          prediction_data: Json
          prediction_type: string
          time_horizon: string
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          ai_model_version?: string | null
          based_on_metrics?: string[] | null
          confidence_level?: number | null
          created_at?: string
          id?: string
          prediction_data?: Json
          prediction_type?: string
          time_horizon?: string
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          blood_type: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          updated_at: string
          user_id: string | null
          weight_kg: number | null
        }
        Insert: {
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          updated_at?: string
          user_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          updated_at?: string
          user_id?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      health_reports: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number | null
          created_at: string
          extracted_data: Json | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          processing_status: string
          report_source: string | null
          upload_date: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          processing_status?: string
          report_source?: string | null
          upload_date?: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          processing_status?: string
          report_source?: string | null
          upload_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      health_settings: {
        Row: {
          alert_thresholds: Json | null
          created_at: string
          dashboard_layout: Json | null
          health_goals: Json | null
          id: string
          notification_preferences: Json | null
          privacy_settings: Json | null
          units_system: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_thresholds?: Json | null
          created_at?: string
          dashboard_layout?: Json | null
          health_goals?: Json | null
          id?: string
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          units_system?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_thresholds?: Json | null
          created_at?: string
          dashboard_layout?: Json | null
          health_goals?: Json | null
          id?: string
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          units_system?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          buyer_details: Json | null
          company_details: Json
          created_at: string
          discount_amount: number
          id: string
          invoice_number: string
          line_items: Json
          pdf_url: string | null
          public_url: string | null
          qr_code_url: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          buyer_details?: Json | null
          company_details: Json
          created_at?: string
          discount_amount?: number
          id?: string
          invoice_number: string
          line_items: Json
          pdf_url?: string | null
          public_url?: string | null
          qr_code_url?: string | null
          subtotal: number
          tax_amount?: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          buyer_details?: Json | null
          company_details?: Json
          created_at?: string
          discount_amount?: number
          id?: string
          invoice_number?: string
          line_items?: Json
          pdf_url?: string | null
          public_url?: string | null
          qr_code_url?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      "Live Chat": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      login_logs: {
        Row: {
          device_info: string | null
          id: string
          ip_address: string | null
          login_time: string
          success: boolean
          user_id: string
        }
        Insert: {
          device_info?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string
          success: boolean
          user_id: string
        }
        Update: {
          device_info?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      nearby_hospitals: {
        Row: {
          address: string
          analysis_id: string | null
          created_at: string
          distance_km: number | null
          emergency_contact: string | null
          hospital_name: string
          id: string
          latitude: number | null
          longitude: number | null
          maps_url: string | null
          phone: string | null
          specialties: string[] | null
        }
        Insert: {
          address: string
          analysis_id?: string | null
          created_at?: string
          distance_km?: number | null
          emergency_contact?: string | null
          hospital_name: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          phone?: string | null
          specialties?: string[] | null
        }
        Update: {
          address?: string
          analysis_id?: string | null
          created_at?: string
          distance_km?: number | null
          emergency_contact?: string | null
          hospital_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          phone?: string | null
          specialties?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "nearby_hospitals_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_history"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          drawing_data: Json | null
          folder_id: string | null
          id: string
          is_archived: boolean | null
          is_starred: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          drawing_data?: Json | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_starred?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          drawing_data?: Json | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_starred?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          font_size: number | null
          full_name: string | null
          github_username: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          passcode: string | null
          theme_color: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          font_size?: number | null
          full_name?: string | null
          github_username?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          passcode?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          font_size?: number | null
          full_name?: string | null
          github_username?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          passcode?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_option: number
          created_at: string
          created_by: string
          exam_id: string
          id: string
          options: string[]
          question_id: string
          question_text: string
          series: string | null
        }
        Insert: {
          correct_option: number
          created_at?: string
          created_by: string
          exam_id: string
          id?: string
          options: string[]
          question_id: string
          question_text: string
          series?: string | null
        }
        Update: {
          correct_option?: number
          created_at?: string
          created_by?: string
          exam_id?: string
          id?: string
          options?: string[]
          question_id?: string
          question_text?: string
          series?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          analysis_result: Json | null
          created_at: string
          file_name: string
          file_url: string
          id: string
          report_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          report_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          report_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_factors: {
        Row: {
          contributing_metrics: Json | null
          created_at: string
          description: string | null
          factor_name: string
          id: string
          last_calculated: string
          recommendations: string[] | null
          risk_level: string
          risk_score: number
          user_id: string | null
        }
        Insert: {
          contributing_metrics?: Json | null
          created_at?: string
          description?: string | null
          factor_name: string
          id?: string
          last_calculated?: string
          recommendations?: string[] | null
          risk_level: string
          risk_score: number
          user_id?: string | null
        }
        Update: {
          contributing_metrics?: Json | null
          created_at?: string
          description?: string | null
          factor_name?: string
          id?: string
          last_calculated?: string
          recommendations?: string[] | null
          risk_level?: string
          risk_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          room_id: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          room_id?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          room_id?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          is_host: boolean | null
          is_online: boolean | null
          joined_at: string | null
          room_id: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          id?: string
          is_host?: boolean | null
          is_online?: boolean | null
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          id?: string
          is_host?: boolean | null
          is_online?: boolean | null
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string | null
          room_type: string | null
          share_token: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string | null
          room_type?: string | null
          share_token?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string | null
          room_type?: string | null
          share_token?: string | null
        }
        Relationships: []
      }
      student_user_ids: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          is_assigned: boolean
          teacher_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          is_assigned?: boolean
          teacher_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          is_assigned?: boolean
          teacher_id?: string
          user_id?: string
        }
        Relationships: []
      }
      symptom_analyses: {
        Row: {
          analysis_result: Json
          created_at: string
          id: string
          symptoms: string[]
          user_id: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string
          id?: string
          symptoms: string[]
          user_id: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string
          id?: string
          symptoms?: string[]
          user_id?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          folder_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          folder_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          folder_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          chatbot_icon: string | null
          created_at: string
          font_size: number | null
          id: string
          language: string | null
          notifications: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chatbot_icon?: string | null
          created_at?: string
          font_size?: number | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chatbot_icon?: string | null
          created_at?: string
          font_size?: number | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          aadhaar_image_url: string | null
          college: string | null
          created_at: string
          dob: string | null
          email: string | null
          face_image_url: string | null
          father_name: string | null
          id: string
          job: string | null
          mobile: string | null
          mother_name: string | null
          name: string
          passcode: string | null
          qualification: string | null
          role: string
          school: string | null
          status: string
          teacher_id: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          aadhaar_image_url?: string | null
          college?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          face_image_url?: string | null
          father_name?: string | null
          id?: string
          job?: string | null
          mobile?: string | null
          mother_name?: string | null
          name: string
          passcode?: string | null
          qualification?: string | null
          role: string
          school?: string | null
          status?: string
          teacher_id?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          aadhaar_image_url?: string | null
          college?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          face_image_url?: string | null
          father_name?: string | null
          id?: string
          job?: string | null
          mobile?: string | null
          mother_name?: string | null
          name?: string
          passcode?: string | null
          qualification?: string | null
          role?: string
          school?: string | null
          status?: string
          teacher_id?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      call_openai_chat: {
        Args: { message_content: string; model_name?: string }
        Returns: Json
      }
      cleanup_offline_participants: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_online_status: {
        Args: { online_status: boolean; user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
