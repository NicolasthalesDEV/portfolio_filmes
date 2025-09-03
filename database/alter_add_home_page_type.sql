-- Migration: Add 'home' page_type support to existing page_content table
-- Run this ONLY if your existing table was created before adding 'home'.
-- Safe (idempotent) alteration: drops old CHECK and recreates with new list if needed.

DO $$
DECLARE
  chk_name text;
BEGIN
  -- Locate existing check constraint referencing page_type (if any)
  SELECT con.conname INTO chk_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
  WHERE rel.relname = 'page_content'
    AND con.contype = 'c'
    AND pg_get_constraintdef(con.oid) LIKE '%page_type%';

  IF chk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE page_content DROP CONSTRAINT %I', chk_name);
  END IF;

  -- Recreate constraint including 'home'
  ALTER TABLE page_content
    ADD CONSTRAINT page_content_page_type_check CHECK (page_type IN ('about','contact','home'));
END $$;

COMMENT ON CONSTRAINT page_content_page_type_check ON page_content IS 'Allowed types: about, contact, home';

-- Verification query (optional):
-- SELECT page_type, count(*) FROM page_content GROUP BY 1;
