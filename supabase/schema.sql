-- TooSkill Database Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         jsonb NOT NULL DEFAULT '{"it":"","en":""}',
  description   jsonb NOT NULL DEFAULT '{"it":"","en":""}',
  objectives    jsonb DEFAULT '{"it":[],"en":[]}',
  program       jsonb DEFAULT '{"it":[],"en":[]}',
  prerequisites jsonb DEFAULT '{"it":"","en":""}',
  module        text NOT NULL CHECK (module IN ('FI','CO','SCM','ABAP','FIORI','S4HANA','HANA','OTHER')),
  level         text NOT NULL CHECK (level IN ('express','base','completa','personalizzata')),
  duration_hours integer,
  price_info    text,
  image_url     text,
  is_published  boolean NOT NULL DEFAULT false,
  is_featured   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  company       text,
  phone         text,
  course_id     uuid REFERENCES courses(id) ON DELETE SET NULL,
  course_title  text,
  message       text NOT NULL,
  type          text NOT NULL DEFAULT 'general'
                  CHECK (type IN ('course_inquiry','general','custom_training')),
  status        text NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','read','replied')),
  locale        text NOT NULL DEFAULT 'it',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Public: read published courses only
CREATE POLICY "Public read published courses"
  ON courses FOR SELECT
  USING (is_published = true);

-- Public: insert contact requests (lead capture)
CREATE POLICY "Public insert contact_requests"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

-- Service role bypasses RLS automatically (used by admin client)

-- Sample data (optional — remove in production)
-- INSERT INTO courses (slug, title, description, module, level, duration_hours, price_info, is_published, is_featured)
-- VALUES (
--   'sap-fi-base',
--   '{"it":"SAP FI Base — Contabilità Finanziaria","en":"SAP FI Base — Financial Accounting"}',
--   '{"it":"Formazione base sul modulo SAP FI per key user e analisti IT.","en":"Basic training on SAP FI module for key users and IT analysts."}',
--   'FI', 'base', 24, 'Su richiesta', true, true
-- );
