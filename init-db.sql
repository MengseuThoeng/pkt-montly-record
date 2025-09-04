-- Initialize database with proper settings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone (adjust according to your location)
SET timezone = 'UTC';

-- Create indexes for better performance (Prisma will create these too, but this ensures they exist)
-- These will be created by Prisma migration, so this is just a backup
