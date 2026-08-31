-- SQL Schema for KuthiYengpham by KangleiAstro (Supabase PostgreSQL)

-- 1. Create Orders Table
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

-- 2. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) and public read/write policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write on orders" ON public.orders
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read and write on services" ON public.services
    FOR ALL USING (true) WITH CHECK (true);
