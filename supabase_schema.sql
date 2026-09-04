-- ─────────────────────────────────────────────────────────────
-- Complete SQL Schema for KangleiAstro (Supabase PostgreSQL)
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard
-- ─────────────────────────────────────────────────────────────

-- 1. KV Store Table (For JSON document persistence & settings)
CREATE TABLE IF NOT EXISTS public.kv_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'CLIENT',
    dob TEXT,
    tob TEXT,
    pob TEXT,
    gender TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Astrologers Table
CREATE TABLE IF NOT EXISTS public.astrologers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    specialties JSONB,
    languages JSONB,
    experience_years NUMERIC DEFAULT 5,
    rate_per_min NUMERIC DEFAULT 15,
    rating NUMERIC DEFAULT 4.9,
    total_consultations INTEGER DEFAULT 100,
    avatar TEXT,
    bio TEXT,
    is_online BOOLEAN DEFAULT true,
    phone TEXT,
    email TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Products / E-Store Items Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    stock INTEGER DEFAULT 10,
    description TEXT,
    image TEXT,
    seller_type TEXT DEFAULT 'PLATFORM',
    seller_id TEXT,
    seller_name TEXT,
    status TEXT DEFAULT 'APPROVED',
    rating NUMERIC DEFAULT 4.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Orders Table (Kuthi & E-Store Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_ref TEXT NOT NULL,
    client_name TEXT NOT NULL,
    gender TEXT,
    mobile TEXT,
    whatsapp_no TEXT NOT NULL,
    email TEXT,
    kuthi_attached BOOLEAN DEFAULT false,
    kuthi_file_name TEXT,
    dob TEXT,
    tob TEXT,
    pob TEXT,
    utr TEXT,
    amount NUMERIC DEFAULT 499,
    service_title TEXT,
    status TEXT DEFAULT 'PENDING',
    father_name TEXT,
    mother_name TEXT,
    delivery_address TEXT,
    category TEXT,
    assigned_astrologer_id TEXT,
    assigned_astrologer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Consultations Table
CREATE TABLE IF NOT EXISTS public.consultations (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    astrologer_id TEXT NOT NULL,
    astrologer_name TEXT NOT NULL,
    mode TEXT DEFAULT 'CHAT',
    status TEXT DEFAULT 'LIVE',
    rate_per_min NUMERIC DEFAULT 15,
    remaining_seconds INTEGER DEFAULT 900,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Consultation Messages Table
CREATE TABLE IF NOT EXISTS public.consultation_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    text TEXT,
    attachment JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. OTP Codes Table
CREATE TABLE IF NOT EXISTS public.otps (
    phone TEXT PRIMARY KEY,
    otp_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable Row Level Security (RLS) and public read/write access policies
ALTER TABLE public.kv_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access on kv_store" ON public.kv_store;
CREATE POLICY "Public access on kv_store" ON public.kv_store FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on users" ON public.users;
CREATE POLICY "Public access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on astrologers" ON public.astrologers;
CREATE POLICY "Public access on astrologers" ON public.astrologers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on products" ON public.products;
CREATE POLICY "Public access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on orders" ON public.orders;
CREATE POLICY "Public access on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on services" ON public.services;
CREATE POLICY "Public access on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on consultations" ON public.consultations;
CREATE POLICY "Public access on consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on consultation_messages" ON public.consultation_messages;
CREATE POLICY "Public access on consultation_messages" ON public.consultation_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on otps" ON public.otps;
CREATE POLICY "Public access on otps" ON public.otps FOR ALL USING (true) WITH CHECK (true);
