-- Create default admin user (this would typically be done through Supabase Auth UI)
-- This is just for reference - actual admin creation should be done through proper signup

-- Note: In production, you would create the admin user through Supabase Auth
-- and then manually insert into admin_profiles table, or use the signup process

-- Example of what the admin_profiles entry would look like:
-- INSERT INTO admin_profiles (id, full_name, role) 
-- VALUES ('admin-user-uuid-here', 'Admin UMKM', 'admin');

-- For development, you can create an admin user through the auth signup process
-- and the trigger will automatically create the admin profile
