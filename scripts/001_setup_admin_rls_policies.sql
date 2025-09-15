-- Create RLS policies for admin access to job_postings table
-- This allows admin operations without requiring user authentication

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin access to job_postings" ON job_postings;
DROP POLICY IF EXISTS "Allow public read access to job_postings" ON job_postings;

-- Enable RLS on job_postings table
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active job postings
CREATE POLICY "Allow public read access to job_postings" 
ON job_postings FOR SELECT 
USING (is_active = true);

-- Allow full access for admin operations (bypass RLS for service role)
CREATE POLICY "Allow admin access to job_postings" 
ON job_postings FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for company_info table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin access to company_info" ON company_info;
DROP POLICY IF EXISTS "Allow public read access to company_info" ON company_info;

-- Enable RLS on company_info table
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access to company info
CREATE POLICY "Allow public read access to company_info" 
ON company_info FOR SELECT 
USING (true);

-- Allow full access for admin operations
CREATE POLICY "Allow admin access to company_info" 
ON company_info FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for other admin tables
-- Products table
DROP POLICY IF EXISTS "Allow admin access to products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow admin access to products" 
ON products FOR ALL 
USING (true) 
WITH CHECK (true);

-- Product categories table
DROP POLICY IF EXISTS "Allow admin access to product_categories" ON product_categories;
DROP POLICY IF EXISTS "Allow public read access to product_categories" ON product_categories;

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product_categories" 
ON product_categories FOR SELECT 
USING (true);

CREATE POLICY "Allow admin access to product_categories" 
ON product_categories FOR ALL 
USING (true) 
WITH CHECK (true);

-- Gallery table
DROP POLICY IF EXISTS "Allow admin access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery" 
ON gallery FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow admin access to gallery" 
ON gallery FOR ALL 
USING (true) 
WITH CHECK (true);

-- Blog articles table
DROP POLICY IF EXISTS "Allow admin access to blog_articles" ON blog_articles;
DROP POLICY IF EXISTS "Allow public read access to blog_articles" ON blog_articles;

ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to blog_articles" 
ON blog_articles FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow admin access to blog_articles" 
ON blog_articles FOR ALL 
USING (true) 
WITH CHECK (true);

-- Contact messages table (admin only)
DROP POLICY IF EXISTS "Allow admin access to contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow insert contact_messages" ON contact_messages;

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin access to contact_messages" 
ON contact_messages FOR ALL 
USING (true) 
WITH CHECK (true);
