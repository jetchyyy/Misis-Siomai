import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, TENANT_ID } from '../lib/supabase';
import { useCMS } from '../context/CMSContext';
import {
  Users, Store, ShoppingBag, HelpCircle, Search, Filter,
  RefreshCw, ExternalLink, Calendar, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, AlertCircle, Eye, X, Utensils,
  ShieldCheck, Lock, LogOut, KeyRound, Loader2, Home, Info,
  Package, Menu as MenuIcon, Save, Plus, Trash2, Upload, Image as ImageIcon, Heart
} from 'lucide-react';

export default function AdminDashboard() {
  // Auth state
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState('inquiries');

  // CMS Context
  const { cms, updateSection } = useCMS();

  // Inquiries data state
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  // Editable local CMS states for forms
  const [cmsHome, setCmsHome] = useState(cms.home);
  const [cmsAbout, setCmsAbout] = useState(cms.about);
  const [cmsContact, setCmsContact] = useState(cms.contact);
  const [cmsPackages, setCmsPackages] = useState(cms.packages || []);
  const [cmsProducts, setCmsProducts] = useState(cms.products || []);
  const [cmsBranches, setCmsBranches] = useState(cms.branches || []);
  const [cmsSocials, setCmsSocials] = useState(cms.socials || { title: '', description: '', events: [] });

  // Admin Branch filter & pagination states
  const [adminBranchSearch, setAdminBranchSearch] = useState('');
  const [adminBranchCityFilter, setAdminBranchCityFilter] = useState('All');
  const [adminBranchStatusFilter, setAdminBranchStatusFilter] = useState('all');
  const [adminBranchVisibleCount, setAdminBranchVisibleCount] = useState(10);

  const [saveSuccess, setSaveSuccess] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [uploadingAssetKey, setUploadingAssetKey] = useState(null);

  useEffect(() => {
    setCmsHome(cms.home);
    setCmsAbout(cms.about);
    setCmsContact(cms.contact);
    setCmsPackages(cms.packages || []);
    setCmsProducts(cms.products || []);
    setCmsBranches(cms.branches || []);
    setCmsSocials(cms.socials || { title: '', description: '', events: [] });
  }, [cms]);

  // Check Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    }).catch(err => {
      console.warn('Supabase auth session check warning:', err);
      setAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch inquiries from Supabase & LocalStorage
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    setFetchError('');
    try {
      // 1. Get local storage items
      let localInquiries = [];
      try {
        localInquiries = JSON.parse(localStorage.getItem('misis_siomai_inquiries') || '[]');
      } catch (e) {
        console.warn('LocalStorage parse error:', e);
      }

      // 2. Get remote Supabase items
      let remoteInquiries = [];
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .eq('tenant_id', TENANT_ID)
          .order('created_at', { ascending: false });

        if (!error && data) {
          remoteInquiries = data.map(item => ({
            ...item,
            status: item.status || 'New',
            custom_fields: item.custom_fields || {}
          }));
        }
      } catch (remoteErr) {
        console.warn('Supabase fetch notice:', remoteErr);
      }

      // 3. Merge & Deduplicate
      const seenIds = new Set();
      const combined = [];

      [...localInquiries, ...remoteInquiries].forEach(item => {
        const key = item.id || `${item.email}_${item.created_at}`;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          combined.push({
            ...item,
            status: item.status || 'New',
            custom_fields: item.custom_fields || {}
          });
        }
      });

      // Sort by date descending
      combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setInquiries(combined);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchInquiries();
    }
    const handleInquiryEvent = () => {
      fetchInquiries();
    };
    window.addEventListener('misis_siomai_inquiry_submitted', handleInquiryEvent);
    return () => window.removeEventListener('misis_siomai_inquiry_submitted', handleInquiryEvent);
  }, [session]);

  // Handle Login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
      } else {
        setSession(data.session);
      }
    } catch (err) {
      setLoginError('Invalid login credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setSession(null);
  };

  const handleUpdateLeadStatus = async (id, newStatus) => {
    setInquiries(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status: newStatus } : item);
      try {
        localStorage.setItem('misis_siomai_inquiries', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // ─── WebP Compression Helper ──────────────────────────────────────────────
  // Compresses an image file to WebP format targeting ~100KB max size.
  const compressToWebP = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively reduce quality until file is under 100KB
        const TARGET_BYTES = 100 * 1024;
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= TARGET_BYTES || quality <= 0.1) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
            } else {
              quality = Math.max(0.1, quality - 0.1);
              tryCompress();
            }
          }, 'image/webp', quality);
        };
        tryCompress();
      };
      img.src = url;
    });
  };

  // Image Upload Handler for Products
  const handleProductImageUpload = async (idx, file) => {
    if (!file) return;
    setUploadingIdx(idx);

    try {
      // Compress to WebP ~100KB before uploading
      const compressed = await compressToWebP(file);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
      const filePath = `${TENANT_ID}/products/${fileName}`;

      // Upload compressed WebP to Supabase storage bucket 'cms_assets'
      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' });

      if (error) {
        console.warn('Supabase storage upload fallback to base64:', error.message);
        // Fallback: use compressed blob as DataURL
        const reader = new FileReader();
        reader.onloadend = () => {
          const updated = [...cmsProducts];
          updated[idx].image_url = reader.result;
          setCmsProducts(updated);
          setUploadingIdx(null);
        };
        reader.readAsDataURL(compressed);
      } else {
        // Get Public URL
        const { data: publicData } = supabase.storage
          .from('cms_assets')
          .getPublicUrl(filePath);

        const updated = [...cmsProducts];
        updated[idx].image_url = publicData.publicUrl;
        setCmsProducts(updated);
        setUploadingIdx(null);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      // Fallback: use compressed blob as DataURL
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...cmsProducts];
        updated[idx].image_url = reader.result;
        setCmsProducts(updated);
        setUploadingIdx(null);
      };
      reader.readAsDataURL(compressed);
    }
  };

  // Product Add / Remove
  const handleAddProduct = () => {
    const newProd = {
      id: `prod-${Date.now()}`,
      name: 'New Siomai Flavor',
      category: 'Steamed Siomai',
      price: '₱45 / 4 pcs',
      description: 'Juicy 100% pork & beef dimsum cooked fresh daily.',
      image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600',
      is_popular: false
    };
    setCmsProducts(prev => [newProd, ...prev]);
  };

  const handleRemoveProduct = (idx) => {
    setCmsProducts(prev => prev.filter((_, i) => i !== idx));
  };

  // Package Add / Remove & Features
  const handleAddPackage = () => {
    const newPkg = {
      id: `pkg-${Date.now()}`,
      name: 'New Franchise Package',
      price: '₱150,000',
      description: 'Complete turnkey package for neighborhood hubs or food parks.',
      badge: 'New Package',
      is_popular: false,
      features: [
        'Heavy Duty Stainless Food Cart / Kiosk',
        'Complete Cooking & Steaming Equipment',
        'Initial Product Inventory Worth ₱15,000',
        'Crew Operations Training & Manual'
      ]
    };
    setCmsPackages(prev => [newPkg, ...prev]);
  };

  const handleRemovePackage = (idx) => {
    setCmsPackages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddPackageFeature = (pkgIdx) => {
    const updated = [...cmsPackages];
    if (!updated[pkgIdx].features) updated[pkgIdx].features = [];
    updated[pkgIdx].features.push('New Package Inclusion');
    setCmsPackages(updated);
  };

  const handleRemovePackageFeature = (pkgIdx, featureIdx) => {
    const updated = [...cmsPackages];
    updated[pkgIdx].features = (updated[pkgIdx].features || []).filter((_, i) => i !== featureIdx);
    setCmsPackages(updated);
  };

  const handleUpdatePackageFeature = (pkgIdx, featureIdx, val) => {
    const updated = [...cmsPackages];
    if (!updated[pkgIdx].features) updated[pkgIdx].features = [];
    updated[pkgIdx].features[featureIdx] = val;
    setCmsPackages(updated);
  };

  // Branch Add / Remove
  const handleAddBranch = () => {
    const newBranch = {
      id: `br-${Date.now()}`,
      name: 'New Misis Siomai Branch',
      city: 'Cebu City',
      address: 'Enter location / street address',
      phone: '0932 2329484',
      hours: '8:00 AM - 8:00 PM',
      is_active: true
    };
    setCmsBranches(prev => [newBranch, ...prev]);
  };

  const handleRemoveBranch = (idx) => {
    setCmsBranches(prev => prev.filter((_, i) => i !== idx));
  };


  // CMS Save Handlers
  const triggerSaveNotification = (msg) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleSaveHome = async () => {
    try {
      await updateSection('home', cmsHome);
      triggerSaveNotification('Home Page CMS settings saved to database successfully!');
    } catch (err) {
      alert(`Database Save Error: ${err.message || err}`);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await updateSection('about', cmsAbout);
      triggerSaveNotification('About Us & Logo settings saved to database successfully!');
    } catch (err) {
      alert(`Database Save Error: ${err.message || err}`);
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateSection('contact', cmsContact);
      triggerSaveNotification('Contact Directory CMS settings saved to database successfully!');
    } catch (err) {
      alert(`Database Save Error: ${err.message || err}`);
    }
  };

  const handleSavePackages = async () => {
    try {
      await updateSection('packages', cmsPackages);
      triggerSaveNotification('Franchise Packages CMS saved to database successfully!');
    } catch (err) {
      alert(`Database Save Error: ${err.message || err}`);
    }
  };

  const handleSaveProducts = async () => {
    try {
      await updateSection('products', cmsProducts);
      triggerSaveNotification('Products Menu & Images saved to database successfully!');
    } catch (err) {
      alert(`Database Save Error: ${err.message || err}`);
    }
  };

  // Asset Upload Handler (Hero BG, Logo, Mascot)
  const handleSiteAssetUpload = async (assetType, file) => {
    if (!file) return;
    setUploadingAssetKey(assetType);
    try {
      const compressed = await compressToWebP(file);
      const fileName = `${assetType}_${Date.now()}.webp`;
      const filePath = `${TENANT_ID}/assets/${fileName}`;

      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' });

      let url = '';
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('cms_assets').getPublicUrl(filePath);
        url = publicUrlData.publicUrl;
      } else {
        // Fallback to base64 DataURL if storage bucket upload failed
        url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(compressed);
        });
      }

      if (assetType === 'hero_bg') {
        const updated = { ...cmsHome, hero_bg_image: url };
        setCmsHome(updated);
        await updateSection('home', updated);
      } else if (assetType === 'logo') {
        const updated = { ...cmsAbout, logo_url: url };
        setCmsAbout(updated);
        await updateSection('about', updated);
      } else if (assetType === 'navbar_logo') {
        const updated = { ...cmsAbout, navbar_logo_url: url };
        setCmsAbout(updated);
        await updateSection('about', updated);
      } else if (assetType === 'mascot') {
        const updated = { ...cmsAbout, mascot_image: url };
        setCmsAbout(updated);
        await updateSection('about', updated);
      }
      triggerSaveNotification(`Updated site asset (${assetType}) in database successfully!`);
    } catch (err) {
      console.error('Asset upload error:', err);
      alert(`Database Asset Save Error: ${err.message || err}`);
    } finally {
      setUploadingAssetKey(null);
    }
  };

  // Charity Event Image Upload Handler
  const handleEventImageUpload = async (idx, file) => {
    if (!file) return;
    setUploadingIdx(`event-${idx}`);
    try {
      const compressed = await compressToWebP(file);
      const fileName = `event_${Date.now()}_${idx}.webp`;
      const filePath = `${TENANT_ID}/events/${fileName}`;

      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' });

      const updatedEvents = [...(cmsSocials.events || [])];
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('cms_assets').getPublicUrl(filePath);
        updatedEvents[idx].image = publicUrlData.publicUrl;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedEvents[idx].image = reader.result;
          setCmsSocials(prev => ({ ...prev, events: updatedEvents }));
        };
        reader.readAsDataURL(compressed);
        return;
      }
      setCmsSocials(prev => ({ ...prev, events: updatedEvents }));
    } catch (err) {
      console.error('Event image upload error:', err);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSaveSocials = async () => {
    await updateSection('socials', cmsSocials);
    triggerSaveNotification('Socials & Charity Events CMS saved successfully!');
  };

  const handleSaveBranches = async () => {
    await updateSection('branches', cmsBranches);
    triggerSaveNotification('Branch Locations CMS saved successfully!');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">Verifying Admin Credentials...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 text-zinc-100 font-sans">
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-rose-600 to-amber-500" />
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto">
              <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">Misis Siomai Cebu</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">ADMIN CMS</span>
              </div>
              <p className="text-xs text-zinc-400">Sign in to configure CMS pages & leads</p>
            </div>
          </div>

          {loginError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="email"
                  placeholder="admin@misissiomai.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-heading font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to CMS Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-zinc-400 hover:text-rose-400 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: 'inquiries', name: 'Leads & Inquiries', icon: Users, badge: inquiries.filter(i => i.status === 'New').length || 0 },
    { id: 'assets', name: 'Site Images & Logos', icon: ImageIcon },
    { id: 'home', name: 'Home Page CMS', icon: Home },
    { id: 'about', name: 'About (Mission & Vision)', icon: Info },
    { id: 'packages', name: 'Packages CMS', icon: Package },
    { id: 'products', name: 'Products & Images CMS', icon: MenuIcon },
    { id: 'branches', name: 'Branches CMS', icon: MapPin },
    { id: 'socials', name: 'Socials & Charity Events', icon: Heart },
    { id: 'contact', name: 'Contact & Social Links CMS', icon: Phone },
  ];

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.custom_fields?.target_city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.custom_fields?.selected_package || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || item.inquiry_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row">

      {/* Sidebar Component */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col justify-between">
        <div>

          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-10 h-10 object-contain" />
            <div>
              <h2 className="font-heading font-extrabold text-base text-white tracking-wide">Misis Siomai</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">CMS CONTROL</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {navTabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${isActive
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/40'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-400 text-zinc-950">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-3">

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* TAB 1: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Customer Leads & Inquiries</h1>
                <p className="text-xs text-zinc-400">Incoming franchise applications & customer inquiries</p>
              </div>
              <button
                onClick={fetchInquiries}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  <option value="all">All Types</option>
                  <option value="franchise">Franchise</option>
                  <option value="bulk_order">Bulk Order</option>
                  <option value="general">General</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Contact">In Contact</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Approved">Approved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-5">Applicant</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Target City</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500 space-y-1">
                        <Users className="w-8 h-8 mx-auto text-zinc-600" />
                        <p className="font-semibold text-zinc-400">No leads found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-xs text-zinc-400">{item.email} • {item.phone}</div>
                        </td>
                        <td className="py-4 px-5 text-xs font-bold text-rose-400 capitalize">{item.inquiry_type}</td>
                        <td className="py-4 px-5 text-xs text-zinc-300">{item.custom_fields?.target_city || 'N/A'}</td>
                        <td className="py-4 px-5">
                          <select
                            value={item.status || 'New'}
                            onChange={(e) => handleUpdateLeadStatus(item.id, e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 text-xs rounded-lg px-2 py-1 font-semibold text-zinc-200"
                          >
                            <option value="New">New</option>
                            <option value="In Contact">In Contact</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Approved">Approved</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-4 px-5 text-xs text-zinc-500">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedLead(item)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 cursor-pointer ml-auto transition-colors"
                            title="View Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SITE IMAGES & LOGOS CMS */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Site Images & Logos CMS</h1>
                <p className="text-xs text-zinc-400">Manage site logos, navbar branding, hero background, and mascot images with file upload or direct URL</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Primary Brand Logo (Footer, Favicon, Splash Screen) */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-heading font-bold text-base text-white">Primary Logo</h3>
                  </div>
                  <p className="text-xs text-zinc-400">Used for Footer, Browser Favicon, and App Splash Screen</p>

                  <div className="h-44 rounded-xl bg-[#18572c] border border-zinc-800 overflow-hidden relative group flex items-center justify-center p-6">
                    <img 
                      src={cmsAbout.logo_url || '/mississiomai.png'} 
                      alt="Primary Brand Logo Preview" 
                      className="max-h-full max-w-full object-contain drop-shadow-xl" 
                      onError={(e) => { e.target.src = '/mississiomai.png'; }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Logo URL</label>
                    <input
                      type="text"
                      placeholder="/mississiomai.png or URL"
                      value={cmsAbout.logo_url || ''}
                      onChange={(e) => setCmsAbout(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                  <label className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'logo' ? 'bg-zinc-700 opacity-60 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                    {uploadingAssetKey === 'logo' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
                    ) : (
                      <><Upload className="w-4 h-4" /><span>Upload Logo</span></>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingAssetKey === 'logo'}
                      onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('logo', e.target.files[0])}
                    />
                  </label>
                  <button
                    onClick={handleSaveAbout}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* 2. Navbar Logo */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-sky-400" />
                    <h3 className="font-heading font-bold text-base text-white">Navbar Logo</h3>
                  </div>
                  <p className="text-xs text-zinc-400">Horizontal/Side logo displayed exclusively in the top navigation bar</p>

                  <div className="h-44 rounded-xl bg-[#18572c] border border-zinc-800 overflow-hidden relative group flex items-center justify-center p-6">
                    <img 
                      src={cmsAbout.navbar_logo_url || '/misissiomailogoside.png'} 
                      alt="Navbar Logo Preview" 
                      className="max-h-full max-w-full object-contain drop-shadow-xl" 
                      onError={(e) => { e.target.src = '/misissiomailogoside.png'; }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Navbar Logo URL</label>
                    <input
                      type="text"
                      placeholder="/misissiomailogoside.png or URL"
                      value={cmsAbout.navbar_logo_url || ''}
                      onChange={(e) => setCmsAbout(prev => ({ ...prev, navbar_logo_url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                  <label className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'navbar_logo' ? 'bg-zinc-700 opacity-60 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'}`}>
                    {uploadingAssetKey === 'navbar_logo' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
                    ) : (
                      <><Upload className="w-4 h-4" /><span>Upload Nav Logo</span></>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingAssetKey === 'navbar_logo'}
                      onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('navbar_logo', e.target.files[0])}
                    />
                  </label>
                  <button
                    onClick={handleSaveAbout}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* 3. Hero Background Image */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-rose-400" />
                    <h3 className="font-heading font-bold text-base text-white">Hero Background</h3>
                  </div>
                  <p className="text-xs text-zinc-400">Appears behind the main title on the home page hero section</p>

                  <div className="h-44 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative group flex items-center justify-center">
                    <img 
                      src={cmsHome.hero_bg_image || '/siomai.jpg'} 
                      alt="Hero Background Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = '/siomai.jpg'; }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hero BG Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={cmsHome.hero_bg_image || ''}
                      onChange={(e) => setCmsHome(prev => ({ ...prev, hero_bg_image: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                  <label className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'hero_bg' ? 'bg-zinc-700 opacity-60 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500'}`}>
                    {uploadingAssetKey === 'hero_bg' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
                    ) : (
                      <><Upload className="w-4 h-4" /><span>Upload Hero BG</span></>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingAssetKey === 'hero_bg'}
                      onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('hero_bg', e.target.files[0])}
                    />
                  </label>
                  <button
                    onClick={handleSaveHome}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* 4. Mascot Image */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <h3 className="font-heading font-bold text-base text-white">Misis Siomai Mascot</h3>
                  </div>
                  <p className="text-xs text-zinc-400">Character mascot displayed in the About section</p>

                  <div className="h-44 rounded-xl bg-[#FAF3E3] border border-zinc-800 overflow-hidden relative group flex items-center justify-center p-4">
                    <img 
                      src={cmsAbout.mascot_image || '/mascot.webp'} 
                      alt="Mascot Preview" 
                      className="max-h-full max-w-full object-contain" 
                      onError={(e) => { e.target.src = '/mascot.webp'; }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mascot Image URL</label>
                    <input
                      type="text"
                      placeholder="/mascot.webp or URL"
                      value={cmsAbout.mascot_image || ''}
                      onChange={(e) => setCmsAbout(prev => ({ ...prev, mascot_image: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                  <label className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'mascot' ? 'bg-zinc-700 opacity-60 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500'}`}>
                    {uploadingAssetKey === 'mascot' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
                    ) : (
                      <><Upload className="w-4 h-4" /><span>Upload Mascot</span></>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={uploadingAssetKey === 'mascot'}
                      onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('mascot', e.target.files[0])}
                    />
                  </label>
                  <button
                    onClick={handleSaveAbout}
                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: HOME PAGE CMS */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Home Page CMS</h1>
                <p className="text-xs text-zinc-400">Configure hero section title, subtitle, badge, and stats</p>
              </div>
              <button
                onClick={handleSaveHome}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Home CMS</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Hero Section Title</label>
                <input
                  type="text"
                  value={cmsHome.hero_title || ''}
                  onChange={(e) => setCmsHome(prev => ({ ...prev, hero_title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={cmsHome.hero_subtitle || ''}
                  onChange={(e) => setCmsHome(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Header Tagline / Badge</label>
                  <input
                    type="text"
                    value={cmsHome.badge || ''}
                    onChange={(e) => setCmsHome(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">CTA Button Text</label>
                  <input
                    type="text"
                    value={cmsHome.cta_button || ''}
                    onChange={(e) => setCmsHome(prev => ({ ...prev, cta_button: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT CMS */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">About Us CMS (Mission & Vision)</h1>
                <p className="text-xs text-zinc-400">Configure core mission, vision, brand story, and brand name</p>
              </div>
              <button
                onClick={handleSaveAbout}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Mission & Vision</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Brand Name</label>
                  <input
                    type="text"
                    value={cmsAbout.brand_name || ''}
                    onChange={(e) => setCmsAbout(prev => ({ ...prev, brand_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Tagline</label>
                  <input
                    type="text"
                    value={cmsAbout.tagline || ''}
                    onChange={(e) => setCmsAbout(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={cmsAbout.mission || ''}
                  onChange={(e) => setCmsAbout(prev => ({ ...prev, mission: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={cmsAbout.vision || ''}
                  onChange={(e) => setCmsAbout(prev => ({ ...prev, vision: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Brand Story</label>
                <textarea
                  rows={4}
                  value={cmsAbout.story || ''}
                  onChange={(e) => setCmsAbout(prev => ({ ...prev, story: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGES CMS */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Franchise Packages CMS</h1>
                <p className="text-xs text-zinc-400">Manage packages, prices, inclusions, and popular highlights</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddPackage}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Package</span>
                </button>
                <button
                  onClick={handleSavePackages}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Packages</span>
                </button>
              </div>
            </div>

            {cmsPackages.length === 0 ? (
              <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
                <Package className="w-12 h-12 text-zinc-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Packages Added Yet</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Click the button below to add your first franchise package.
                  </p>
                </div>
                <button
                  onClick={handleAddPackage}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Package</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cmsPackages.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                          Package #{cmsPackages.length - idx}
                        </span>
                        <h3 className="font-bold text-sm text-white truncate max-w-xs">{pkg.name || 'Unnamed Package'}</h3>
                      </div>
                      <button
                        onClick={() => handleRemovePackage(idx)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Package Name</label>
                        <input
                          type="text"
                          value={pkg.name || ''}
                          onChange={(e) => {
                            const updated = [...cmsPackages];
                            updated[idx].name = e.target.value;
                            setCmsPackages(updated);
                          }}
                          placeholder="e.g. Food Cart Package"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Price</label>
                        <input
                          type="text"
                          value={pkg.price || ''}
                          onChange={(e) => {
                            const updated = [...cmsPackages];
                            updated[idx].price = e.target.value;
                            setCmsPackages(updated);
                          }}
                          placeholder="e.g. ₱99,000"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 font-bold focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Badge / Tagline</label>
                        <input
                          type="text"
                          value={pkg.badge || ''}
                          onChange={(e) => {
                            const updated = [...cmsPackages];
                            updated[idx].badge = e.target.value;
                            setCmsPackages(updated);
                          }}
                          placeholder="e.g. Starter Choice, Most Popular"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">Description</label>
                      <input
                        type="text"
                        value={pkg.description || ''}
                        onChange={(e) => {
                          const updated = [...cmsPackages];
                          updated[idx].description = e.target.value;
                          setCmsPackages(updated);
                        }}
                        placeholder="Brief overview of ideal location or business model"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* Features / Inclusions List */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-300">Package Inclusions & Features</label>
                        <button
                          type="button"
                          onClick={() => handleAddPackageFeature(idx)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Inclusion</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(pkg.features || []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => handleUpdatePackageFeature(idx, fIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-rose-500 focus:outline-none"
                              placeholder="e.g. Free crew training"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePackageFeature(idx, fIdx)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                              title="Remove inclusion"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Checkbox Toggle */}
                    <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(pkg.is_popular)}
                          onChange={(e) => {
                            const updated = [...cmsPackages];
                            updated[idx].is_popular = e.target.checked;
                            setCmsPackages(updated);
                          }}
                          className="rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-xs text-zinc-300 font-semibold">
                          Mark as Most Popular / Featured Highlight
                        </span>
                      </label>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PRODUCTS & IMAGES CMS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Products & Images CMS</h1>
                <p className="text-xs text-zinc-400">Manage dimsum menu items, categories, pricing, and upload product images</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={handleSaveProducts}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Products</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {cmsProducts.map((prod, idx) => (
                <div key={prod.id || idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Image Preview & Upload Box */}
                    <div className="w-full md:w-48 shrink-0 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Product Image</label>
                      <div className="relative h-36 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center group">
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-3 text-zinc-600">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                            <span className="text-[10px]">No image set</span>
                          </div>
                        )}

                        {uploadingIdx === idx && (
                          <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* File Upload Button */}
                      <label className={`w-full py-2 px-3 rounded-xl text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${uploadingIdx === idx ? 'bg-zinc-700 border-zinc-600 opacity-60 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'}`}>
                        {uploadingIdx === idx ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" /><span>Compressing...</span></>
                        ) : (
                          <><Upload className="w-3.5 h-3.5 text-rose-400" /><span>Upload Image (WebP)</span></>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingIdx === idx}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleProductImageUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Form Controls */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Item Name</label>
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => {
                              const updated = [...cmsProducts];
                              updated[idx].name = e.target.value;
                              setCmsProducts(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                          />
                        </div>

                        <button
                          onClick={() => handleRemoveProduct(idx)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer self-end"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Category</label>
                          <input
                            type="text"
                            value={prod.category}
                            onChange={(e) => {
                              const updated = [...cmsProducts];
                              updated[idx].category = e.target.value;
                              setCmsProducts(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Price</label>
                          <input
                            type="text"
                            value={prod.price}
                            onChange={(e) => {
                              const updated = [...cmsProducts];
                              updated[idx].price = e.target.value;
                              setCmsProducts(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Image URL (or paste link)</label>
                        <input
                          type="text"
                          value={prod.image_url || ''}
                          onChange={(e) => {
                            const updated = [...cmsProducts];
                            updated[idx].image_url = e.target.value;
                            setCmsProducts(updated);
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Description</label>
                        <input
                          type="text"
                          value={prod.description || ''}
                          onChange={(e) => {
                            const updated = [...cmsProducts];
                            updated[idx].description = e.target.value;
                            setCmsProducts(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id={`bestseller-${idx}`}
                          checked={Boolean(prod.is_popular)}
                          onChange={(e) => {
                            const updated = [...cmsProducts];
                            updated[idx].is_popular = e.target.checked;
                            setCmsProducts(updated);
                          }}
                          className="rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-rose-500"
                        />
                        <label htmlFor={`bestseller-${idx}`} className="text-xs text-zinc-300 font-semibold cursor-pointer">
                          Mark as Bestseller / Featured Tag
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BRANCHES CMS */}
        {activeTab === 'branches' && (() => {
          // Compute cities for admin filter
          const adminCities = ['All', ...Array.from(new Set(cmsBranches.map(b => b.city?.trim()).filter(Boolean)))];

          // Filter branches
          const filteredAdminBranches = cmsBranches.filter((br) => {
            if (adminBranchCityFilter !== 'All' && br.city !== adminBranchCityFilter) return false;
            if (adminBranchStatusFilter === 'active' && br.is_active === false) return false;
            if (adminBranchStatusFilter === 'inactive' && br.is_active !== false) return false;
            if (!adminBranchSearch.trim()) return true;
            const term = adminBranchSearch.toLowerCase();
            return (
              (br.name && br.name.toLowerCase().includes(term)) ||
              (br.address && br.address.toLowerCase().includes(term)) ||
              (br.city && br.city.toLowerCase().includes(term)) ||
              (br.phone && br.phone.toLowerCase().includes(term))
            );
          });

          // Paginated view
          const visibleAdminBranches = filteredAdminBranches.slice(0, adminBranchVisibleCount);

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading font-extrabold text-3xl text-white">Branches CMS</h1>
                  <p className="text-xs text-zinc-400">
                    Configure franchise locations, addresses, contact details, and operating hours ({cmsBranches.length} total)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddBranch}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Branch</span>
                  </button>
                  <button
                    onClick={handleSaveBranches}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Branches</span>
                  </button>
                </div>
              </div>

              {/* Admin Search & Filter Controls */}
              {cmsBranches.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search by branch name, address, or city..."
                        value={adminBranchSearch}
                        onChange={(e) => {
                          setAdminBranchSearch(e.target.value);
                          setAdminBranchVisibleCount(10);
                        }}
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
                      />
                      {adminBranchSearch && (
                        <button
                          onClick={() => setAdminBranchSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Status filter dropdown / pills */}
                    <div className="flex items-center gap-2">
                      <select
                        value={adminBranchStatusFilter}
                        onChange={(e) => {
                          setAdminBranchStatusFilter(e.target.value);
                          setAdminBranchVisibleCount(10);
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-semibold focus:border-rose-500 focus:outline-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>

                      <span className="text-xs text-zinc-400 font-medium px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        {filteredAdminBranches.length} of {cmsBranches.length}
                      </span>
                    </div>

                  </div>

                  {/* City Pills */}
                  {adminCities.length > 2 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1 shrink-0">
                        City:
                      </span>
                      {adminCities.map(city => (
                        <button
                          key={city}
                          onClick={() => {
                            setAdminBranchCityFilter(city);
                            setAdminBranchVisibleCount(10);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                            adminBranchCityFilter === city
                              ? 'bg-rose-600 text-white border-rose-500 font-bold'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* No Branches Added State */}
              {cmsBranches.length === 0 ? (
                <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
                  <MapPin className="w-12 h-12 text-zinc-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">No Branches Added Yet</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Click the button below to add your first store location or franchise branch.
                    </p>
                  </div>
                  <button
                    onClick={handleAddBranch}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Branch</span>
                  </button>
                </div>
              ) : filteredAdminBranches.length === 0 ? (
                <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
                  <Search className="w-8 h-8 text-zinc-600 mx-auto" />
                  <h3 className="text-sm font-bold text-white">No matching branches found</h3>
                  <p className="text-xs text-zinc-400">
                    No branches matched your search query "{adminBranchSearch}".
                  </p>
                  <button
                    onClick={() => {
                      setAdminBranchSearch('');
                      setAdminBranchCityFilter('All');
                      setAdminBranchStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleAdminBranches.map((br) => {
                    const realIndex = cmsBranches.findIndex(b => b === br || (b.id && b.id === br.id));
                    const idx = realIndex !== -1 ? realIndex : cmsBranches.indexOf(br);

                    return (
                      <div key={br.id || idx} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-extrabold text-[10px] uppercase tracking-wider">
                              Branch #{cmsBranches.length - idx}
                            </span>
                            <h3 className="font-bold text-sm text-white truncate max-w-xs">{br.name || 'Unnamed Branch'}</h3>
                          </div>
                          <button
                            onClick={() => handleRemoveBranch(idx)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete Branch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400">Branch Name</label>
                            <input
                              type="text"
                              value={br.name || ''}
                              onChange={(e) => {
                                const updated = [...cmsBranches];
                                updated[idx].name = e.target.value;
                                setCmsBranches(updated);
                              }}
                              placeholder="e.g. Misis Siomai Main Headquarters"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400">City / Region</label>
                            <input
                              type="text"
                              value={br.city || ''}
                              onChange={(e) => {
                                const updated = [...cmsBranches];
                                updated[idx].city = e.target.value;
                                setCmsBranches(updated);
                              }}
                              placeholder="e.g. Talisay City, Cebu"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Full Address</label>
                          <input
                            type="text"
                            value={br.address || ''}
                            onChange={(e) => {
                              const updated = [...cmsBranches];
                              updated[idx].address = e.target.value;
                              setCmsBranches(updated);
                            }}
                            placeholder="e.g. Ramona Village, San Isidro"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400">Contact Number(s)</label>
                            <input
                              type="text"
                              value={br.phone || ''}
                              onChange={(e) => {
                                const updated = [...cmsBranches];
                                updated[idx].phone = e.target.value;
                                setCmsBranches(updated);
                              }}
                              placeholder="e.g. 0932 2329484 / 0995 5662713"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-400">Operating Hours</label>
                            <input
                              type="text"
                              value={br.hours || ''}
                              onChange={(e) => {
                                const updated = [...cmsBranches];
                                updated[idx].hours = e.target.value;
                                setCmsBranches(updated);
                              }}
                              placeholder="e.g. 8:00 AM - 6:00 PM"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={br.is_active !== false}
                              onChange={(e) => {
                                const updated = [...cmsBranches];
                                updated[idx].is_active = e.target.checked;
                                setCmsBranches(updated);
                              }}
                              className="rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-rose-500"
                            />
                            <span className="text-xs text-zinc-300 font-semibold">
                              Branch Active & Listed on Site
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}

                  {/* Load More Pagination for Admin */}
                  {filteredAdminBranches.length > adminBranchVisibleCount && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setAdminBranchVisibleCount(prev => prev + 10)}
                        className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>Load More Branches ({filteredAdminBranches.length - adminBranchVisibleCount} remaining)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 7: SOCIALS & CHARITY EVENTS CMS */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Socials & Charity Events CMS</h1>
                <p className="text-xs text-zinc-400">Manage community outreach events, charity drives, photos, and stories</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newEvent = {
                      id: `event-${Date.now()}`,
                      title: 'New Community Outreach Drive',
                      category: 'Community Outreach',
                      date: 'Upcoming Initiative',
                      location: 'Cebu City',
                      impact: 'Community Support',
                      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
                      description: 'Description of the charity drive or community outreach event...',
                      highlights: ['Fresh food distribution', 'Volunteer effort'],
                      quote: '"Giving back to our community with pure heart."'
                    };
                    setCmsSocials(prev => ({ ...prev, events: [newEvent, ...(prev.events || [])] }));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-zinc-700"
                >
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>Add Charity Event</span>
                </button>
                <button
                  onClick={handleSaveSocials}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Socials CMS</span>
                </button>
              </div>
            </div>

            {/* Section Header Editor */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">Socials Section Overview Text</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Section Headline Title</label>
                  <input
                    type="text"
                    value={cmsSocials.title || ''}
                    onChange={(e) => setCmsSocials(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Section Subtitle / Narrative</label>
                  <textarea
                    rows={2}
                    value={cmsSocials.description || ''}
                    onChange={(e) => setCmsSocials(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-white">Community & Charity Event Stories ({(cmsSocials.events || []).length})</h3>
              
              {(cmsSocials.events || []).map((evt, idx) => (
                <div key={evt.id || idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 relative">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                      Event #{idx + 1} · {evt.category || 'Outreach'}
                    </span>
                    <button
                      onClick={() => {
                        const updated = cmsSocials.events.filter((_, i) => i !== idx);
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-red-800/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Event</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Photo & Image Control */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Event Banner Photo</label>
                      <div className="h-44 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative group flex items-center justify-center">
                        <img 
                          src={evt.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'} 
                          alt={evt.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Image URL..."
                          value={evt.image || ''}
                          onChange={(e) => {
                            const updated = [...cmsSocials.events];
                            updated[idx].image = e.target.value;
                            setCmsSocials(prev => ({ ...prev, events: updated }));
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 outline-none focus:border-rose-500 font-mono"
                        />
                        <label className={`w-full py-2 px-3 rounded-xl text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${uploadingIdx === `event-${idx}` ? 'bg-zinc-700 border-zinc-600 opacity-60 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'}`}>
                          {uploadingIdx === `event-${idx}` ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" /><span>Uploading...</span></>
                          ) : (
                            <><Upload className="w-3.5 h-3.5 text-rose-400" /><span>Upload Event Photo</span></>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingIdx === `event-${idx}`}
                            onChange={(e) => e.target.files?.[0] && handleEventImageUpload(idx, e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Event Details Form */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Event Title</label>
                          <input
                            type="text"
                            value={evt.title || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].title = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Category Tag</label>
                          <input
                            type="text"
                            value={evt.category || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].category = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            placeholder="e.g. Feeding Program / Youth & Education"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Location</label>
                          <input
                            type="text"
                            value={evt.location || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].location = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Date / Initiative Type</label>
                          <input
                            type="text"
                            value={evt.date || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].date = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500 font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Impact Badge Label</label>
                          <input
                            type="text"
                            value={evt.impact || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].impact = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 focus:border-rose-500 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400">Full Event Story Description</label>
                        <textarea
                          rows={3}
                          value={evt.description || ''}
                          onChange={(e) => {
                            const updated = [...cmsSocials.events];
                            updated[idx].description = e.target.value;
                            setCmsSocials(prev => ({ ...prev, events: updated }));
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-rose-500 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Key Highlights (comma separated)</label>
                          <input
                            type="text"
                            value={(evt.highlights || []).join(', ')}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].highlights = e.target.value.split(',').map(s => s.trim());
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:border-rose-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400">Inspirational Quote</label>
                          <input
                            type="text"
                            value={evt.quote || ''}
                            onChange={(e) => {
                              const updated = [...cmsSocials.events];
                              updated[idx].quote = e.target.value;
                              setCmsSocials(prev => ({ ...prev, events: updated }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-emerald-300 italic focus:border-rose-500"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 8: CONTACT & SOCIAL LINKS CMS */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Contact & Social Links CMS</h1>
                <p className="text-xs text-zinc-400">Manage official contact information, social media links, and online delivery links</p>
              </div>
              <button
                onClick={handleSaveContact}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact & Social Links</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
              
              {/* Management Contacts */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-white border-b border-zinc-800 pb-2">Business & Management Directory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">General Manager Name</label>
                    <input
                      type="text"
                      value={cmsContact.general_manager || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, general_manager: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Physical HQ Address</label>
                    <input
                      type="text"
                      value={cmsContact.address || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Phone Numbers (comma separated)</label>
                    <input
                      type="text"
                      value={(cmsContact.phones || []).join(', ')}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, phones: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Email Addresses (comma separated)</label>
                    <input
                      type="text"
                      value={(cmsContact.emails || []).join(', ')}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, emails: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="font-heading font-bold text-lg text-white border-b border-zinc-800 pb-2">Social Media Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Facebook Page Name</label>
                    <input
                      type="text"
                      value={cmsContact.facebook || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Facebook URL</label>
                    <input
                      type="text"
                      value={cmsContact.facebook_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, facebook_url: e.target.value }))}
                      placeholder="https://www.facebook.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Instagram URL</label>
                    <input
                      type="text"
                      value={cmsContact.instagram_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, instagram_url: e.target.value }))}
                      placeholder="https://www.instagram.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">TikTok URL</label>
                    <input
                      type="text"
                      value={cmsContact.tiktok_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, tiktok_url: e.target.value }))}
                      placeholder="https://www.tiktok.com/@..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={cmsContact.youtube_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://www.youtube.com/@..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-amber-300 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Online Delivery Links */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="font-heading font-bold text-lg text-white border-b border-zinc-800 pb-2">Online Delivery & Messaging Platforms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Foodpanda Store URL</label>
                    <input
                      type="text"
                      value={cmsContact.foodpanda_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, foodpanda_url: e.target.value }))}
                      placeholder="https://www.foodpanda.ph/..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-pink-400 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">GrabFood Store URL</label>
                    <input
                      type="text"
                      value={cmsContact.grabfood_url || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, grabfood_url: e.target.value }))}
                      placeholder="https://food.grab.com/ph/..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-emerald-400 outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">WhatsApp Hotline Number</label>
                    <input
                      type="text"
                      value={cmsContact.whatsapp_number || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="0932 2329484"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Viber Hotline Number</label>
                    <input
                      type="text"
                      value={cmsContact.viber_number || ''}
                      onChange={(e) => setCmsContact(prev => ({ ...prev, viber_number: e.target.value }))}
                      placeholder="0932 2329484"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Lead Detail Modal Overlay */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-extrabold text-[10px] uppercase tracking-wider border border-rose-500/20">
                    {selectedLead.inquiry_type || 'General'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Submitted: {new Date(selectedLead.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-white">
                  {selectedLead.name}
                </h2>
              </div>
              
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Information & Target City / Package */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Contact Info</span>
                <div className="space-y-1.5 text-xs">
                  <p className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline hover:text-rose-300 truncate">
                      {selectedLead.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="hover:underline hover:text-emerald-300">
                      {selectedLead.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Inquiry Details</span>
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Target Location: <strong className="text-white">{selectedLead.custom_fields?.target_city || 'Not specified'}</strong></span>
                  </p>
                  {selectedLead.custom_fields?.selected_package && (
                    <p className="flex items-center gap-2 font-medium">
                      <Package className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Selected Package: <strong className="text-amber-300">{selectedLead.custom_fields.selected_package}</strong></span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Status Control */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Application Status</span>
              <select
                value={selectedLead.status || 'New'}
                onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-rose-400 focus:border-rose-500 outline-none cursor-pointer"
              >
                <option value="New">New Lead</option>
                <option value="In Contact">In Contact</option>
                <option value="Qualified">Qualified</option>
                <option value="Approved">Approved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Complete Submitted Message */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Customer Message / Note</span>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedLead.message || 'No additional message provided.'}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedLead.email}?subject=Misis%20Siomai%20Inquiry%20Response`}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
