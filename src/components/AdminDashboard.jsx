import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, TENANT_ID } from '../lib/supabase';
import { useCMS } from '../context/CMSContext';
import MisisSiomaiLogo from './MisisSiomaiLogo';
import {
  Users, Store, ShoppingBag, HelpCircle, Search, Filter,
  RefreshCw, ExternalLink, Calendar, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, AlertCircle, Eye, X, Utensils,
  ShieldCheck, Lock, LogOut, KeyRound, Loader2, Home, Info,
  Package, Menu as MenuIcon, Save, Plus, Trash2, Upload, Image as ImageIcon
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

  const [saveSuccess, setSaveSuccess] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);

  useEffect(() => {
    setCmsHome(cms.home);
    setCmsAbout(cms.about);
    setCmsContact(cms.contact);
    setCmsPackages(cms.packages || []);
    setCmsProducts(cms.products || []);
    setCmsBranches(cms.branches || []);
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

  // Fetch inquiries from Supabase
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    setFetchError('');
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        setFetchError(error.message || 'Failed to fetch inquiries.');
        setInquiries([]);
      } else {
        const formatted = (data || []).map(item => ({
          ...item,
          status: item.status || 'New',
          custom_fields: item.custom_fields || {}
        }));
        setInquiries(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setFetchError('Error connecting to database.');
      setInquiries([]);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchInquiries();
    }
  }, [session]);

  // Handle Login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setLoginError(error.message || 'Invalid login credentials.');
      } else if (data.session) {
        setSession(data.session);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An error occurred during authentication.');
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
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
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

  // Image Upload Handler for Products
  const handleProductImageUpload = async (idx, file) => {
    if (!file) return;
    setUploadingIdx(idx);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${TENANT_ID}/products/${fileName}`;

      // Upload file to Supabase storage bucket 'cms_assets'
      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.warn('Supabase storage upload fallback to base64:', error.message);
        // Fallback to FileReader DataURL
        const reader = new FileReader();
        reader.onloadend = () => {
          const updated = [...cmsProducts];
          updated[idx].image_url = reader.result;
          setCmsProducts(updated);
          setUploadingIdx(null);
        };
        reader.readAsDataURL(file);
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
      // Fallback to FileReader DataURL
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...cmsProducts];
        updated[idx].image_url = reader.result;
        setCmsProducts(updated);
        setUploadingIdx(null);
      };
      reader.readAsDataURL(file);
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

  // CMS Save Handlers
  const triggerSaveNotification = (msg) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleSaveHome = async () => {
    await updateSection('home', cmsHome);
    triggerSaveNotification('Home Page CMS settings saved successfully!');
  };

  const handleSaveAbout = async () => {
    await updateSection('about', cmsAbout);
    triggerSaveNotification('About Us (Mission & Vision) saved successfully!');
  };

  const handleSaveContact = async () => {
    await updateSection('contact', cmsContact);
    triggerSaveNotification('Contact Directory CMS settings saved successfully!');
  };

  const handleSavePackages = async () => {
    await updateSection('packages', cmsPackages);
    triggerSaveNotification('Franchise Packages CMS saved successfully!');
  };

  const handleSaveProducts = async () => {
    await updateSection('products', cmsProducts);
    triggerSaveNotification('Products Menu & Uploaded Images saved successfully!');
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
              <MisisSiomaiLogo className="w-full h-full" />
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
    { id: 'home', name: 'Home Page CMS', icon: Home },
    { id: 'about', name: 'About (Mission & Vision)', icon: Info },
    { id: 'packages', name: 'Packages CMS', icon: Package },
    { id: 'products', name: 'Products & Images CMS', icon: MenuIcon },
    { id: 'branches', name: 'Branches CMS', icon: MapPin },
    { id: 'contact', name: 'Contact Info CMS', icon: Phone },
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
            <MisisSiomaiLogo className="w-10 h-10" />
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
                            className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:text-white text-xs font-bold cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* TAB 2: HOME PAGE CMS */}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Franchise Packages CMS</h1>
                <p className="text-xs text-zinc-400">Manage packages, prices, inclusions, and popular highlights</p>
              </div>
              <button
                onClick={handleSavePackages}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Packages</span>
              </button>
            </div>

            <div className="space-y-4">
              {cmsPackages.map((pkg, idx) => (
                <div key={pkg.id || idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">Package Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const updated = [...cmsPackages];
                          updated[idx].name = e.target.value;
                          setCmsPackages(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">Price</label>
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => {
                          const updated = [...cmsPackages];
                          updated[idx].price = e.target.value;
                          setCmsPackages(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">Badge</label>
                      <input
                        type="text"
                        value={pkg.badge || ''}
                        onChange={(e) => {
                          const updated = [...cmsPackages];
                          updated[idx].badge = e.target.value;
                          setCmsPackages(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">Description</label>
                    <input
                      type="text"
                      value={pkg.description}
                      onChange={(e) => {
                        const updated = [...cmsPackages];
                        updated[idx].description = e.target.value;
                        setCmsPackages(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
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
                      <label className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-zinc-700">
                        <Upload className="w-3.5 h-3.5 text-rose-400" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
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
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Branches CMS</h1>
                <p className="text-xs text-zinc-400">Configure franchise locations, addresses, and hours</p>
              </div>
              <button
                onClick={handleSaveBranches}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Branches</span>
              </button>
            </div>

            <div className="space-y-4">
              {cmsBranches.map((br, idx) => (
                <div key={br.id || idx} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">Branch Name</label>
                      <input
                        type="text"
                        value={br.name}
                        onChange={(e) => {
                          const updated = [...cmsBranches];
                          updated[idx].name = e.target.value;
                          setCmsBranches(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400">City / Region</label>
                      <input
                        type="text"
                        value={br.city}
                        onChange={(e) => {
                          const updated = [...cmsBranches];
                          updated[idx].city = e.target.value;
                          setCmsBranches(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">Full Address</label>
                    <input
                      type="text"
                      value={br.address}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].address = e.target.value;
                        setCmsBranches(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT INFO CMS */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-extrabold text-3xl text-white">Contact Directory CMS</h1>
                <p className="text-xs text-zinc-400">Manage official General Manager contact info from business card</p>
              </div>
              <button
                onClick={handleSaveContact}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact CMS</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">General Manager Name</label>
                  <input
                    type="text"
                    value={cmsContact.general_manager || ''}
                    onChange={(e) => setCmsContact(prev => ({ ...prev, general_manager: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Facebook Page</label>
                  <input
                    type="text"
                    value={cmsContact.facebook || ''}
                    onChange={(e) => setCmsContact(prev => ({ ...prev, facebook: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Physical Address</label>
                <input
                  type="text"
                  value={cmsContact.address || ''}
                  onChange={(e) => setCmsContact(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                />
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
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
