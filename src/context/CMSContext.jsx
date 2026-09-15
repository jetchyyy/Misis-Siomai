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
    hero_image: '/logo.svg',
    logo_url: '/mississiomai.png',
    navbar_logo_url: '/misissiomailogoside.png',
    mascot_image: ''
  },
  contact: {
    general_manager: 'Lendice Marie A. Cal',
    address: 'Ramona Village, San Isidro, Talisay City, Cebu',
    phones: ['0932 2329484', '0995 5662713'],
    emails: ['misissiomaicebu@gmail.com', 'calsiomaihouse@gmail.com'],
    facebook: 'Misis Siomai Cebu',
    facebook_url: 'https://www.facebook.com/profile.php?id=100028835748373',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: '',
    foodpanda_url: 'https://www.foodpanda.ph/',
    grabfood_url: 'https://food.grab.com/ph/',
    whatsapp_number: '09322329484',
    viber_number: '09322329484',
    operating_hours: 'Monday - Saturday: 8:00 AM - 6:00 PM'
  },
  home: {
    hero_title: 'Start Your Profitable Food Cart Business Today',
    hero_bg_image: '',
    badge: 'Ang Paboritong Siomai ng Bayan',
    cta_button: 'Explore Franchise Packages',
    stat_branches: '50+',
    stat_satisfaction: '99%',
    stat_roi_months: '3-6'
  },
  socials: {
    title: 'Misis Siomai Charity & Community Outreach',
    description: 'Beyond serving 100% pure meat dimsum, our heart lies in uplifting Cebuano families. Through feeding programs, school kit drives, and disaster relief, we share our blessings with the community.',
    events: [
      {
        id: 'event-1',
        title: 'Kusina ng Bayan: Metro Cebu Feeding Drive',
        category: 'Feeding Program',
        date: 'Community Initiative',
        location: 'Talisay City & Colon, Cebu',
        impact: 'Community Feeding Drive',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
        description: 'Misis Siomai Cebu organized a community feeding initiative bringing freshly steamed 100% pure pork siomai rice meals and clean drinking water to children, street vendors, and jeepney drivers across Talisay and Downtown Cebu City.',
        highlights: [
          'Freshly cooked siomai rice bowls prepared by Misis Siomai team',
          'Partnered with local barangay volunteers in Talisay',
          'Distributed hygiene kits and bottled beverages'
        ],
        quote: '"Seeing the bright smiles of our youth as they enjoyed a warm meal reminded us why Misis Siomai is truly Ang Paboritong Siomai ng Bayan."'
      },
      {
        id: 'event-2',
        title: 'Project Balik-Eskwela: School Kits & Dimsum',
        category: 'Youth & Education',
        date: 'School Outreach',
        location: 'San Isidro Elementary School, Cebu',
        impact: 'Youth Education Drive',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
        description: 'Supporting education for underprivileged elementary students. Misis Siomai distributed brand-new backpacks filled with notebooks, writing materials, and delicious dimsum snack packs for young learners preparing for the school year.',
        highlights: [
          'Durable backpacks with complete school supplies',
          'Nutritious dimsum merienda for students and teachers',
          'Special fun games & activities led by the Misis Siomai crew'
        ],
        quote: '"Education changes lives. We are committed to nourishing both the bodies and minds of our future leaders."'
      },
      {
        id: 'event-3',
        title: 'Typhoon & Emergency Calamity Relief',
        category: 'Disaster Relief',
        date: 'Relief Operation',
        location: 'Coastal Barangays in Metro Cebu',
        impact: 'Emergency Relief Operation',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
        description: 'When heavy monsoon floods affected coastal families in Metro Cebu, the Misis Siomai mobile team mobilized emergency aid packages containing essential food supplies, clean water, and instant siomai packs to assist displaced households.',
        highlights: [
          'Family relief packages containing rice & essential food goods',
          'Direct emergency dispatch to remote coastal communities',
          'On-the-ground volunteer relief coordination'
        ],
        quote: '"In times of calamity, Bayanihan is our strongest pillar. Misis Siomai will always stand by our Cebuano families."'
      },
      {
        id: 'event-4',
        title: 'Dimsum Salute to Night Shift Frontliners',
        category: 'Community Outreach',
        date: 'Frontliner Support',
        location: 'Cebu City Hospitals & Emergency Units',
        impact: 'Frontliner Appreciation',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        description: 'A midnight food delivery honoring night-shift healthcare workers, sanitation teams, and emergency responders who work tirelessly while the rest of the city sleeps.',
        highlights: [
          'Hot siomai platters & chili oil packs delivered to local hospitals',
          'Handwritten appreciation cards from the Misis Siomai team',
          'Special discount vouchers for frontliners and their families'
        ],
        quote: '"Our frontliners work around the clock to keep us safe. Giving them a delicious hot meal is our simple way of saying Daghang Salamat!"'
      }
    ]
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
  try { localStorage.removeItem(CACHE_KEY); } catch { }
}
// ─────────────────────────────────────────────────────────────────────────────

export function CMSProvider({ children }) {
  const [cms, setCms] = useState(INITIAL_CMS);
  const [loading, setLoading] = useState(true);

  // Sync CMS data from Supabase
  const loadCMSFromSupabase = async () => {
    // 1. Serve from cache instantly so UI doesn't block
    const cached = readCache();
    if (cached) {
      setCms(prev => ({ ...prev, ...cached }));
      setLoading(false);
    }

    // 2. Always fetch fresh remote data from Supabase to guarantee live server & multi-device sync
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      if (!error && data && data.length > 0) {
        const remoteSettings = {};
        data.forEach(row => {
          remoteSettings[row.section_key] = row.content;
        });

        setCms(prev => ({ ...prev, ...remoteSettings }));
        writeCache(remoteSettings); // refresh cache with verified DB content
      } else if (error) {
        console.warn('Supabase site_settings fetch error:', error);
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

  // Dynamically sync Favicon with primary logo
  useEffect(() => {
    if (cms.about?.logo_url) {
      const favicon = document.querySelector("link[rel='icon']");
      if (favicon) favicon.href = cms.about.logo_url;
      const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
      if (appleIcon) appleIcon.href = cms.about.logo_url;
    }
  }, [cms.about?.logo_url]);

  // Update a section in CMS, sync to Supabase, and bust local cache
  const updateSection = async (sectionKey, newContent) => {
    clearCache();

    // Perform database write and check for PostgREST/RLS error response
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        tenant_id: TENANT_ID,
        section_key: sectionKey,
        content: newContent,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,section_key' });

    if (error) {
      console.error(`Database error saving section "${sectionKey}" to Supabase:`, error);
      throw new Error(`Database error saving "${sectionKey}": ${error.message || error.details || JSON.stringify(error)}`);
    }

    // Update state and write to cache ONLY after verified successful database write
    setCms(prev => {
      const updated = { ...prev, [sectionKey]: newContent };
      const { about, contact, home, packages, products, branches, socials } = updated;
      writeCache({ about, contact, home, packages, products, branches, socials });
      return updated;
    });
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
