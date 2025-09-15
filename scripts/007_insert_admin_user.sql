-- Insert admin user directly into admin_profiles table
-- This will create the admin profile that can be used for login

-- First, let's insert into admin_profiles table
INSERT INTO admin_profiles (id, full_name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Administrator UMKM',
  'super_admin',
  NOW(),
  NOW()
);

-- Also insert some sample company info
INSERT INTO company_info (id, name, description, vision, mission, address, phone, email, operating_hours, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'UMKM Berkah Jaya',
  'Perusahaan UMKM yang bergerak di bidang produk berkualitas untuk kebutuhan sehari-hari',
  'Menjadi UMKM terdepan yang memberikan produk berkualitas dan pelayanan terbaik',
  'Memberikan produk berkualitas tinggi dengan harga terjangkau untuk meningkatkan kesejahteraan masyarakat',
  'Jl. Raya No. 123, Jakarta Selatan',
  '+62 21 1234 5678',
  'info@umkmberkahjaya.com',
  'Senin - Jumat: 08:00 - 17:00 | Sabtu: 08:00 - 15:00',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert some sample product categories
INSERT INTO product_categories (id, name, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Makanan', 'Produk makanan dan minuman', NOW(), NOW()),
  (gen_random_uuid(), 'Kerajinan', 'Produk kerajinan tangan', NOW(), NOW()),
  (gen_random_uuid(), 'Fashion', 'Produk fashion dan aksesoris', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
