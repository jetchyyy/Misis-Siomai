import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, TENANT_ID } from '../lib/supabase';

// Default CMS initial data matching Misis Siomai Cebu official business card & branding
export const INITIAL_CMS = {
  about: {
    brand_name: 'Misis Siomai Cebu',
    tagline: 'From our Kitchen to your Happiness.',
    mission: 'To empower aspiring Filipino micro-entrepreneurs and families by delivering authentic, 100% pure meat dimsum with zero royalty fees, low capital investment, and sustainable business growth.',
    vision: 'To be the most trusted and preferred dimsum food cart franchise nationwide, celebrated for exceptional taste, premium quality, and uplifting local communities.',
    story: 'Founded with a passionate mission: to serve hardworking Filipinos authentic, 100% meat-filled dimsum that is both delicious and accessible. Misis Siomai Cebu empowers entrepreneurs across the Visayas and nationwide to build high-margin, sustainable food businesses.',
    values: [
      '100% Pure Meat Quality',
      'Zero Royalty Fees',
      'Community Empowerment',
      'Fast Return on Investment'
    ],
    hero_image: '/logo.svg'
  },
  contact: {
    general_manager: 'Lendice Marie A. Cal',
    address: 'Ramona Village, San Isidro, Talisay City, Cebu',
    phones: ['0932 2329484', '0995 5662713'],
    emails: ['misissiomaicebu@gmail.com', 'calsiomaihouse@gmail.com'],
    facebook: 'Misis Siomai Cebu',
    facebook_url: 'https://facebook.com/MisisSiomaiCebu',
    operating_hours: 'Monday - Saturday: 8:00 AM - 6:00 PM'
  },
  home: {
    hero_title: 'Start Your Profitable Food Cart Business Today',
    hero_subtitle: 'Authentic 100% Pork & Beef Dimsum. Zero Royalty Fees, High Profit Margins, and Fast ROI!',
    badge: 'Ang Paboritong Siomai ng Bayan',
    cta_button: 'Explore Franchise Packages',
    stat_branches: '50+',
    stat_satisfaction: '99%',
    stat_roi_months: '3-6'
  },
  packages: [
    {
      id: 'pkg-1',
      name: 'Food Cart Package',
      price: '₱99,000',
      description: 'Ideal for high-foot-traffic neighborhood hubs, school zones, and transit terminals.',
      badge: 'Starter Choice',
      is_popular: false,
      features: [
        'Heavy-duty Stainless Food Cart Frame',
        'Complete Steamer & Cooking Equipment',
        'Initial Product Inventory Worth ₱10,000',
        'Uniforms, Signage & Promotional Materials',
        'Crew Training & Franchise Operations Manual',
        'Zero Royalty & Zero Monthly Maintenance Fees'
      ]
    },
    {
      id: 'pkg-2',
      name: 'Mall Kiosk Package',
      price: '₱175,000',
      description: 'Designed for indoor mall hallways, supermarket entrances, and commercial centers.',
      badge: 'Most Popular',
      is_popular: true,
      features: [
        'Custom Premium Illuminated Mall Kiosk Counter',
        'Dual Commercial Electric Steamers & Deep Fryer',
        'Initial Product Inventory Worth ₱20,000',
        'POS Cashier Terminal & Digital Menu Display',
        'Comprehensive Crew & Managerial Training',
        'Marketing Launch Support & Social Media Promotion'
      ]
    },
    {
      id: 'pkg-3',
      name: 'Cloud Kitchen & Delivery Hub',
      price: '₱250,000',
      description: 'Maximize delivery sales on GrabFood & Foodpanda with low overhead cost.',
      badge: 'High Yield',
      is_popular: false,
      features: [
        'Commercial Deep Freezer & Steaming Station',
        'Direct Delivery App Integration (Grab/Foodpanda)',
        'Initial Product Inventory Worth ₱35,000',
        'Packaging Supplies & Branded Takeout Containers',
        'Dedicated Territory Rights & Local Marketing Hub'
      ]
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Special Pork Siomai',
      category: 'Steamed Siomai',
      price: '₱45 / 4 pcs',
      description: 'Made with 100% pure seasoned ground pork wrapped in delicate egg wrappers.',
      image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600',
      is_popular: true
    },
    {
      id: 'prod-2',
      name: 'Beef Siomai Premium',
      category: 'Steamed Siomai',
      price: '₱50 / 4 pcs',
      description: 'Savory beef dimsum blended with aromatic spices and sesame oil.',
      image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=600',
      is_popular: true
    },
    {
      id: 'prod-3',
      name: 'Japanese Seaweed Siomai',
      category: 'Specialty Dimsum',
      price: '₱55 / 4 pcs',
      description: 'Wrapped in crisp nori seaweed sheets filled with pork and shrimp flavor.',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
      is_popular: true
    },
    {
      id: 'prod-4',
      name: 'Crispy Fried Siomai',
      category: 'Fried Specialties',
      price: '₱50 / 4 pcs',
      description: 'Deep-fried golden brown siomai served with signature garlic chili oil.',
      image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600',
      is_popular: false
    }
  ],
  branches: [
    {
      id: 'br-1',
      name: 'Misis Siomai Main Headquarters & Distribution',
      address: 'Ramona Village, San Isidro',
      city: 'Talisay City, Cebu',
      phone: '0932 2329484 / 0995 5662713',
      hours: '8:00 AM - 6:00 PM',
      is_active: true
    },
    {
      id: 'br-2',
      name: 'Talisay City Commercial Hub',
      address: 'Central Highway Junction, Tabunok',
      city: 'Talisay City, Cebu',
      phone: '0932 2329484',
      hours: '9:00 AM - 8:00 PM',
      is_active: true
    },
    {
      id: 'br-3',
      name: 'Cebu City University Station',
      address: 'Near Colon St. Corner P. del Rosario',
      city: 'Cebu City',
      phone: '0995 5662713',
      hours: '8:00 AM - 9:00 PM',
      is_active: true
    }
  ]
};

const CMSContext = createContext(null);

// ─── Cache helpers ──────────────────────────────────────────────────────────
const CACHE_KEY = `cms_cache_${TENANT_ID}`;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null; // stale
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore quota errors silently
  }
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}
// ─────────────────────────────────────────────────────────────────────────────

export function CMSProvider({ children }) {
  const [cms, setCms] = useState(INITIAL_CMS);
  const [loading, setLoading] = useState(true);

  // Sync CMS data from Supabase (only called when cache is stale/missing)
  const loadCMSFromSupabase = async () => {
    // 1. Serve from cache first (instant, zero egress)
    const cached = readCache();
    if (cached) {
      setCms(prev => ({ ...prev, ...cached }));
      setLoading(false);
      return; // ← skip Supabase entirely
    }

    // 2. Cache miss — fetch from Supabase and populate cache
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      if (data && data.length > 0) {
        const remoteSettings = {};
        data.forEach(row => {
          remoteSettings[row.section_key] = row.content;
        });

        setCms(prev => ({ ...prev, ...remoteSettings }));
        writeCache(remoteSettings); // save for next visit
      }
    } catch (err) {
      console.warn('Could not sync remote CMS settings from Supabase, using local defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCMSFromSupabase();
  }, []);

  // Update a section in CMS, sync to Supabase, and bust the cache
  const updateSection = async (sectionKey, newContent) => {
    setCms(prev => ({
      ...prev,
      [sectionKey]: newContent
    }));

    // Bust cache so the next page load re-fetches fresh data
    clearCache();

    try {
      await supabase
        .from('site_settings')
        .upsert({
          tenant_id: TENANT_ID,
          section_key: sectionKey,
          content: newContent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'tenant_id,section_key' });

      // After a successful save, rebuild the cache with the updated state
      // so the *next* visitor gets the fresh version without an extra query
      setCms(prev => {
        const updated = { ...prev, [sectionKey]: newContent };
        // Extract only the remote-overridable keys for caching
        const { about, contact, home, packages, products, branches } = updated;
        writeCache({ about, contact, home, packages, products, branches });
        return updated;
      });
    } catch (err) {
      console.error(`Failed to update ${sectionKey} in Supabase:`, err);
    }
  };

  return (
    <CMSContext.Provider value={{ cms, loading, updateSection }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
