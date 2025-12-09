-- Fix username constraint - allow NULL and remove UNIQUE to allow duplicates
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;

-- Make username nullable if not already
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;

-- Keep the index for lookups but without unique constraint
DROP INDEX IF EXISTS idx_users_username;
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
