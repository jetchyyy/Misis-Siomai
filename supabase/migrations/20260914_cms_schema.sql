-- ========================================================
-- Misis Siomai Multi-Tenant CMS Database Migration
-- Schema: cms
-- Shared DB with tenant_id isolation
-- Safe to re-run multiple times (Idempotent)
-- ========================================================

CREATE SCHEMA IF NOT EXISTS cms;

-- 1. Site Settings (Home, About, Contact, Branding)
CREATE TABLE IF NOT EXISTS cms.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'misis-siomai',
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_tenant_section UNIQUE (tenant_id, section_key)
);

-- 2. Franchise Packages
CREATE TABLE IF NOT EXISTS cms.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'misis-siomai',
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Products
CREATE TABLE IF NOT EXISTS cms.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'misis-siomai',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Siomai',
  price TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Branch Locations
CREATE TABLE IF NOT EXISTS cms.branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'misis-siomai',
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  hours TEXT DEFAULT '8:00 AM - 8:00 PM',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Inquiries
CREATE TABLE IF NOT EXISTS cms.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'misis-siomai',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'franchise',
  message TEXT,
  status TEXT DEFAULT 'New',
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for Multi-Tenant performance
CREATE INDEX IF NOT EXISTS idx_site_settings_tenant ON cms.site_settings(tenant_id, section_key);
CREATE INDEX IF NOT EXISTS idx_packages_tenant ON cms.packages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON cms.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_branches_tenant ON cms.branches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_tenant ON cms.inquiries(tenant_id);

-- Enable RLS
ALTER TABLE cms.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for public reading and admin full access (multi-tenant safe & idempotent)
DROP POLICY IF EXISTS "Public read site_settings" ON cms.site_settings;
CREATE POLICY "Public read site_settings" ON cms.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read packages" ON cms.packages;
CREATE POLICY "Public read packages" ON cms.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON cms.products;
CREATE POLICY "Public read products" ON cms.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read branches" ON cms.branches;
CREATE POLICY "Public read branches" ON cms.branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert inquiries" ON cms.inquiries;
CREATE POLICY "Public insert inquiries" ON cms.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read inquiries" ON cms.inquiries;
CREATE POLICY "Public read inquiries" ON cms.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write site_settings" ON cms.site_settings;
CREATE POLICY "Admin write site_settings" ON cms.site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin write packages" ON cms.packages;
CREATE POLICY "Admin write packages" ON cms.packages FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin write products" ON cms.products;
CREATE POLICY "Admin write products" ON cms.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin write branches" ON cms.branches;
CREATE POLICY "Admin write branches" ON cms.branches FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin update inquiries" ON cms.inquiries;
CREATE POLICY "Admin update inquiries" ON cms.inquiries FOR UPDATE USING (true);

-- Storage bucket initialization for product images & assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms_assets', 'cms_assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read cms_assets" ON storage.objects;
CREATE POLICY "Public read cms_assets" ON storage.objects FOR SELECT USING (bucket_id = 'cms_assets');

DROP POLICY IF EXISTS "Public insert cms_assets" ON storage.objects;
CREATE POLICY "Public insert cms_assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms_assets');

DROP POLICY IF EXISTS "Public update cms_assets" ON storage.objects;
CREATE POLICY "Public update cms_assets" ON storage.objects FOR UPDATE USING (bucket_id = 'cms_assets');
