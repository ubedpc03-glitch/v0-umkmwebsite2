-- Fix admin_profiles table schema by removing unnecessary admin column
-- Drop the admin column that's causing issues
ALTER TABLE admin_profiles DROP COLUMN IF EXISTS admin;

-- Ensure the table has the correct structure
-- Add any missing columns if needed
DO $$
BEGIN
    -- Check if role column exists and has correct type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_profiles' 
        AND column_name = 'role' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE admin_profiles ADD COLUMN role text DEFAULT 'admin';
    END IF;
    
    -- Check if full_name column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_profiles' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE admin_profiles ADD COLUMN full_name text;
    END IF;
END $$;

-- Set default role for existing records
UPDATE admin_profiles SET role = 'admin' WHERE role IS NULL;
