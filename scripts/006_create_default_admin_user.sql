-- Create default admin user for UMKM website
-- This script creates a default admin account for initial access

-- Default Admin Credentials:
-- Email: admin@umkm.com
-- Password: admin123456
-- Role: admin

-- Note: This is for development purposes only
-- In production, change the password immediately after first login

-- First, we need to insert into auth.users (this is typically done through Supabase Auth)
-- For development, you can use these credentials to sign up through the /admin/login page

-- The admin profile will be automatically created through the trigger
-- when the user signs up with the admin email

-- Manual insertion for reference (if needed):
-- INSERT INTO admin_profiles (id, full_name, role, created_at) 
-- VALUES (
--   'replace-with-actual-user-uuid',
--   'Administrator UMKM', 
--   'admin',
--   NOW()
-- );

-- To create the admin user:
-- 1. Go to /admin/login
-- 2. Click "Daftar Admin Baru" 
-- 3. Use email: admin@umkm.com
-- 4. Use password: admin123456
-- 5. Full name: Administrator UMKM

-- Alternative: Create through Supabase dashboard Auth section
