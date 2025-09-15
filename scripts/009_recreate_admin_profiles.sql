-- Recreate admin_profiles table with correct schema
-- Drop and recreate to avoid replica identity issues

-- Drop existing table and recreate
DROP TABLE IF EXISTS admin_profiles CASCADE;

-- Create admin profiles table with correct schema
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Allow admins to view their own profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow admins to update their own profile" ON admin_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins to insert their own profile" ON admin_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Insert default admin data
INSERT INTO admin_profiles (id, full_name, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin UMKM', 'admin')
ON CONFLICT (id) DO NOTHING;
