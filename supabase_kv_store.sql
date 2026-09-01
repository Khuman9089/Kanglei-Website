-- ─────────────────────────────────────────────────────────────
-- KangleiAstro Supabase KV Store Table (For Admin Panel Settings Persistence)
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.kv_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.kv_store ENABLE ROW LEVEL SECURITY;

-- Allow public & service role access to read/write persistent admin settings
DROP POLICY IF EXISTS "Allow public read/write access to kv_store" ON public.kv_store;
CREATE POLICY "Allow public read/write access to kv_store" ON public.kv_store FOR ALL USING (true) WITH CHECK (true);
