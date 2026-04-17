-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create the invitees table
CREATE TABLE IF NOT EXISTS invitees (
  phone TEXT PRIMARY KEY,
  actual_name TEXT,
  greeting_nickname TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('yes', 'no', 'maybe')),
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name TEXT,
  needs_overnight BOOLEAN DEFAULT FALSE,
  additional_notes TEXT,
  user_birthday TEXT,
  birthday_prompted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitees_phone ON invitees(phone);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE invitees ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for the app (since we're using anon key)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations" ON invitees
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Pre-populate with known invitees (their names/nicknames)
-- Uncomment and modify as needed:
-- INSERT INTO invitees (phone, actual_name, greeting_nickname) VALUES
--   ('+15551234567', 'John Smith', 'Johnny'),
--   ('+15559876543', 'Jane Doe', 'Bestie');
