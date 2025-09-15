-- Setup admin authentication and RLS policies

-- Create admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin profiles policies
CREATE POLICY "Allow admins to view their own profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow admins to update their own profile" ON admin_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins to insert their own profile" ON admin_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Update RLS policies for admin access to all tables
-- Company info - admin full access
CREATE POLICY "Allow admin full access to company_info" ON company_info FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Product categories - admin full access
CREATE POLICY "Allow admin full access to product_categories" ON product_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Products - admin full access
CREATE POLICY "Allow admin full access to products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Gallery - admin full access
CREATE POLICY "Allow admin full access to gallery" ON gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Online shops - admin full access
CREATE POLICY "Allow admin full access to online_shops" ON online_shops FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Blog articles - admin full access
CREATE POLICY "Allow admin full access to blog_articles" ON blog_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Contact messages - admin read access
CREATE POLICY "Allow admin read access to contact_messages" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Allow admin update access to contact_messages" ON contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Job postings - admin full access
CREATE POLICY "Allow admin full access to job_postings" ON job_postings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Job applications - admin read access
CREATE POLICY "Allow admin read access to job_applications" ON job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Allow admin update access to job_applications" ON job_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Menu items - admin full access
CREATE POLICY "Allow admin full access to menu_items" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Create function to auto-create admin profile
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new admin users
DROP TRIGGER IF EXISTS on_auth_admin_user_created ON auth.users;
CREATE TRIGGER on_auth_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();
