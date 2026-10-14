export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT'
export type ServiceType = 'QUOTE' | 'REQUEST'
export type RequestType = 'QUOTE' | 'SERVICE_REQUEST'
export type RequestStatus = 'NEW' | 'IN_REVIEW' | 'QUOTE_SENT' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED'
export type PaymentState = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED'
export type RequestSource = 'SITE' | 'WHATSAPP' | 'PHONE' | 'MANUAL'
export type CustomerType = 'LOCAL' | 'DIASPORA'
export type QuoteStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
export type ContactStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED'
export type DocumentType = 'QUOTE' | 'SERVICE_SHEET' | 'RECEIPT'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone: string | null
          email: string | null
          avatar_url: string | null
          role: AppRole
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: AppRole
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: AppRole
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          service_type: ServiceType
          form_key: string
          icon: string | null
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          requires_schedule: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          service_type: ServiceType
          form_key?: string
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          requires_schedule?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          service_type?: ServiceType
          form_key?: string
          icon?: string | null
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          requires_schedule?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string
          whatsapp: string | null
          country: string | null
          city: string | null
          region: string | null
          address: string | null
          customer_type: CustomerType
          notes: string | null
          consent_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone: string
          whatsapp?: string | null
          country?: string | null
          city?: string | null
          region?: string | null
          address?: string | null
          customer_type?: CustomerType
          notes?: string | null
          consent_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string
          whatsapp?: string | null
          country?: string | null
          city?: string | null
          region?: string | null
          address?: string | null
          customer_type?: CustomerType
          notes?: string | null
          consent_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          reference: string
          public_token: string
          customer_id: string
          beneficiary_id: string | null
          service_id: string
          parent_request_id: string | null
          request_type: RequestType
          status: RequestStatus
          payment_state: PaymentState
          source: RequestSource
          assigned_to: string | null
          preferred_date: string | null
          preferred_time: string | null
          description: string | null
          internal_notes: string | null
          currency: string
          cancelled_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference: string
          public_token?: string
          customer_id: string
          beneficiary_id?: string | null
          service_id: string
          parent_request_id?: string | null
          request_type: RequestType
          status?: RequestStatus
          payment_state?: PaymentState
          source?: RequestSource
          assigned_to?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          description?: string | null
          internal_notes?: string | null
          currency?: string
          cancelled_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string
          public_token?: string
          customer_id?: string
          beneficiary_id?: string | null
          service_id?: string
          parent_request_id?: string | null
          request_type?: RequestType
          status?: RequestStatus
          payment_state?: PaymentState
          source?: RequestSource
          assigned_to?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          description?: string | null
          internal_notes?: string | null
          currency?: string
          cancelled_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          request_id: string
          quote_number: string
          version: number
          parent_quote_id: string | null
          status: QuoteStatus
          subtotal: number
          discount: number
          tax: number
          total: number
          deposit_amount: number | null
          currency: string
          valid_until: string | null
          terms: string | null
          notes: string | null
          public_token: string
          sent_at: string | null
          viewed_at: string | null
          accepted_at: string | null
          accepted_by_name: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          quote_number: string
          version?: number
          parent_quote_id?: string | null
          status?: QuoteStatus
          subtotal?: number
          discount?: number
          tax?: number
          total?: number
          deposit_amount?: number | null
          currency?: string
          valid_until?: string | null
          terms?: string | null
          notes?: string | null
          public_token?: string
          sent_at?: string | null
          viewed_at?: string | null
          accepted_at?: string | null
          accepted_by_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          quote_number?: string
          version?: number
          parent_quote_id?: string | null
          status?: QuoteStatus
          subtotal?: number
          discount?: number
          tax?: number
          total?: number
          deposit_amount?: number | null
          currency?: string
          valid_until?: string | null
          terms?: string | null
          notes?: string | null
          public_token?: string
          sent_at?: string | null
          viewed_at?: string | null
          accepted_at?: string | null
          accepted_by_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          is_public: boolean
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          is_public?: boolean
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          is_public?: boolean
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: AppRole
      service_type: ServiceType
      request_type: RequestType
      request_status: RequestStatus
      payment_state: PaymentState
      request_source: RequestSource
      customer_type: CustomerType
      quote_status: QuoteStatus
      payment_status: PaymentStatus
      contact_status: ContactStatus
      document_type: DocumentType
    }
  }
}
