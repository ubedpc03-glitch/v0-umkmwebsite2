-- Seed initial data for UMKM website

-- Insert default company info
INSERT INTO company_info (name, description, vision, mission, address, phone, email, whatsapp, operating_hours) VALUES (
  'UMKM Berkah Jaya',
  'Usaha Mikro Kecil Menengah yang bergerak di bidang produk lokal berkualitas tinggi dengan harga terjangkau.',
  'Menjadi UMKM terdepan yang memberikan produk berkualitas dan pelayanan terbaik untuk masyarakat.',
  'Menghadirkan produk-produk lokal berkualitas tinggi dengan harga yang terjangkau dan pelayanan yang memuaskan.',
  'Jl. Raya Berkah No. 123, Jakarta Selatan',
  '+62 21 1234 5678',
  'info@umkmberkahjaya.com',
  '+62 812 3456 7890',
  '{"senin": "08:00-17:00", "selasa": "08:00-17:00", "rabu": "08:00-17:00", "kamis": "08:00-17:00", "jumat": "08:00-17:00", "sabtu": "08:00-15:00", "minggu": "tutup"}'::jsonb
);

-- Insert product categories
INSERT INTO product_categories (name, description) VALUES 
('Makanan & Minuman', 'Produk makanan dan minuman segar berkualitas'),
('Kerajinan Tangan', 'Produk kerajinan tangan unik dan berkualitas'),
('Fashion & Aksesoris', 'Produk fashion dan aksesoris trendy'),
('Kesehatan & Kecantikan', 'Produk kesehatan dan kecantikan alami');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, is_featured) VALUES 
('Keripik Singkong Original', 'Keripik singkong renyah dengan rasa original yang gurih', 15000, (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' LIMIT 1), true),
('Tas Rajut Handmade', 'Tas rajut buatan tangan dengan desain unik dan berkualitas', 85000, (SELECT id FROM product_categories WHERE name = 'Kerajinan Tangan' LIMIT 1), true),
('Kaos Batik Modern', 'Kaos dengan motif batik modern yang nyaman dipakai', 65000, (SELECT id FROM product_categories WHERE name = 'Fashion & Aksesoris' LIMIT 1), false),
('Sabun Herbal Alami', 'Sabun herbal dari bahan-bahan alami untuk kulit sehat', 25000, (SELECT id FROM product_categories WHERE name = 'Kesehatan & Kecantikan' LIMIT 1), true);

-- Insert online shop links
INSERT INTO online_shops (name, url, sort_order) VALUES 
('Shopee', 'https://shopee.co.id/umkmberkahjaya', 1),
('Tokopedia', 'https://tokopedia.com/umkmberkahjaya', 2),
('Bukalapak', 'https://bukalapak.com/u/umkmberkahjaya', 3),
('Lazada', 'https://lazada.co.id/shop/umkmberkahjaya', 4);

-- Insert sample blog articles
INSERT INTO blog_articles (title, slug, content, excerpt, is_published, published_at) VALUES 
('Tips Memilih Produk UMKM Berkualitas', 'tips-memilih-produk-umkm-berkualitas', 'Dalam memilih produk UMKM, ada beberapa hal yang perlu diperhatikan...', 'Panduan lengkap memilih produk UMKM yang berkualitas dan terpercaya', true, NOW()),
('Manfaat Mendukung UMKM Lokal', 'manfaat-mendukung-umkm-lokal', 'Mendukung UMKM lokal memiliki banyak manfaat untuk perekonomian...', 'Mengapa penting mendukung UMKM lokal untuk kemajuan ekonomi bangsa', true, NOW());

-- Insert sample job postings
INSERT INTO job_postings (title, description, requirements, location, employment_type) VALUES 
('Marketing Digital', 'Dibutuhkan marketing digital untuk mengembangkan bisnis online', 'Pengalaman minimal 1 tahun di bidang digital marketing, menguasai social media', 'Jakarta Selatan', 'Full Time'),
('Admin Gudang', 'Dibutuhkan admin gudang untuk mengelola stok produk', 'Teliti, jujur, dan bertanggung jawab', 'Jakarta Selatan', 'Part Time');

-- Insert default menu items
INSERT INTO menu_items (name, url, sort_order) VALUES 
('Beranda', '/', 1),
('Tentang Kami', '/about', 2),
('Katalog Produk', '/products', 3),
('Galeri', '/gallery', 4),
('Toko Online', '/online-shops', 5),
('Blog', '/blog', 6),
('Kontak', '/contact', 7),
('Karir', '/careers', 8);
