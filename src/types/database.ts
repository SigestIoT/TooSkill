export type CourseModule = 'FI' | 'CO' | 'SCM' | 'ABAP' | 'FIORI' | 'S4HANA' | 'HANA' | 'OTHER'
export type CourseLevel = 'express' | 'base' | 'completa' | 'personalizzata'
export type ContactType = 'course_inquiry' | 'general' | 'custom_training'
export type ContactStatus = 'new' | 'read' | 'replied'

export interface LocalizedString {
  it: string
  en: string
}

export interface ProgramSection {
  title: string
  items: string[]
}

export interface LocalizedProgram {
  it: ProgramSection[]
  en: ProgramSection[]
}

export interface LocalizedStringArray {
  it: string[]
  en: string[]
}

export interface Course {
  id: string
  slug: string
  title: LocalizedString
  description: LocalizedString
  objectives: LocalizedStringArray
  program: LocalizedProgram
  prerequisites: LocalizedString
  module: CourseModule
  level: CourseLevel
  duration_hours: number | null
  price_info: string | null
  image_url: string | null
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ContactRequest {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  course_id: string | null
  course_title: string | null
  message: string
  type: ContactType
  status: ContactStatus
  locale: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at'>>
      }
      contact_requests: {
        Row: ContactRequest
        Insert: Omit<ContactRequest, 'id' | 'created_at' | 'status'>
        Update: Partial<Pick<ContactRequest, 'status'>>
      }
    }
  }
}
