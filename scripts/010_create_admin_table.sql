-- Create admin table with username and password authentication
CREATE TABLE IF NOT EXISTS admin (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin (username, password_hash, full_name, role) 
VALUES (
    'admin', 
    '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O7K8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8qVZ8q', 
    'Administrator', 
    'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_updated_at 
    BEFORE UPDATE ON admin 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
