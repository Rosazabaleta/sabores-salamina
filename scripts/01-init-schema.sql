-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE quotation_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  role user_role DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Beverages table
CREATE TABLE IF NOT EXISTS public.beverages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  volume VARCHAR(50),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type VARCHAR(100),
  guest_count INTEGER NOT NULL,
  notes TEXT,
  status quotation_status DEFAULT 'pending',
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotation items (dishes/beverages selected for a quotation)
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  item_type VARCHAR(50), -- 'dish' or 'beverage'
  item_id UUID,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INTEGER NOT NULL,
  special_requests TEXT,
  status reservation_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for dishes (public read, admin write)
CREATE POLICY "Anyone can view dishes" ON public.dishes FOR SELECT USING (true);
CREATE POLICY "Only admin can insert dishes" ON public.dishes FOR INSERT WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admin can update dishes" ON public.dishes FOR UPDATE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admin can delete dishes" ON public.dishes FOR DELETE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for beverages (public read, admin write)
CREATE POLICY "Anyone can view beverages" ON public.beverages FOR SELECT USING (true);
CREATE POLICY "Only admin can insert beverages" ON public.beverages FOR INSERT WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admin can update beverages" ON public.beverages FOR UPDATE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admin can delete beverages" ON public.beverages FOR DELETE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for quotations
CREATE POLICY "Clients can view their own quotations" ON public.quotations
  FOR SELECT USING (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Clients can create quotations" ON public.quotations
  FOR INSERT WITH CHECK (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Clients can update their own quotations" ON public.quotations
  FOR UPDATE USING (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for quotation items
CREATE POLICY "Users can view quotation items" ON public.quotation_items
  FOR SELECT USING (
    (SELECT auth.uid() = client_id FROM public.quotations WHERE quotations.id = quotation_items.quotation_id) OR 
    ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
  );

CREATE POLICY "Users can create quotation items" ON public.quotation_items
  FOR INSERT WITH CHECK (true);

-- RLS Policies for reservations
CREATE POLICY "Clients can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Clients can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Clients can update their own reservations" ON public.reservations
  FOR UPDATE USING (auth.uid() = client_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_quotations_client_id ON public.quotations(client_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_event_date ON public.quotations(event_date);
CREATE INDEX idx_quotation_items_quotation_id ON public.quotation_items(quotation_id);
CREATE INDEX idx_reservations_client_id ON public.reservations(client_id);
CREATE INDEX idx_reservations_event_date ON public.reservations(event_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
