-- Add is_active column to gallery table to match admin interface
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing records to be active
UPDATE gallery SET is_active = TRUE WHERE is_active IS NULL;
