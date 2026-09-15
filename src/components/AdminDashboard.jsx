import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, TENANT_ID } from '../lib/supabase';
import { useCMS } from '../context/CMSContext';
import AdminLogin from './admin/AdminLogin';
import AdminSidebar from './admin/AdminSidebar';
import AdminInquiriesTab from './admin/tabs/AdminInquiriesTab';
import AdminAssetsTab from './admin/tabs/AdminAssetsTab';
import AdminHomeTab from './admin/tabs/AdminHomeTab';
import AdminAboutTab from './admin/tabs/AdminAboutTab';
import AdminPackagesTab from './admin/tabs/AdminPackagesTab';
import AdminProductsTab from './admin/tabs/AdminProductsTab';
import AdminBranchesTab from './admin/tabs/AdminBranchesTab';
import AdminSocialsTab from './admin/tabs/AdminSocialsTab';
import AdminContactTab from './admin/tabs/AdminContactTab';
import {
  Users, Phone, MapPin, CheckCircle2, Loader2, Home, Info,
  Package, Menu as MenuIcon, Image as ImageIcon, Heart
} from 'lucide-react';

export default function AdminDashboard() {
  // Auth state
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);


  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState('inquiries');

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('misis_siomai_admin_theme') || 'dark');
  
  useEffect(() => {
    localStorage.setItem('misis_siomai_admin_theme', theme);
  }, [theme]);

  // CMS Context
  const { cms, updateSection } = useCMS();

  // Inquiries data state
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [fetchError, setFetchError] = useState('');


  // Editable local CMS states for forms
  const [cmsHome, setCmsHome] = useState(cms.home);
  const [cmsAbout, setCmsAbout] = useState(cms.about);
  const [cmsContact, setCmsContact] = useState(cms.contact);
  const [cmsPackages, setCmsPackages] = useState(cms.packages || []);
  const [cmsProducts, setCmsProducts] = useState(cms.products || []);
  const [cmsBranches, setCmsBranches] = useState(cms.branches || []);
  const [cmsSocials, setCmsSocials] = useState(cms.socials || { title: '', description: '', events: [] });

  // Admin Branch filter & pagination states


  const [saveSuccess, setSaveSuccess] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [uploadingAssetKey, setUploadingAssetKey] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

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
      const compressed = await compressToWebP(file);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
      const filePath = `${TENANT_ID}/products/${fileName}`;

      // Upload compressed WebP to Supabase storage bucket 'cms_assets'
      const { data, error } = await supabase.storage
        .from('cms_assets')
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' });

      if (error) {
        console.error('Supabase storage upload failed:', error.message);
        alert(`Image Upload Error: ${error.message}`);
        setUploadingIdx(null);
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
      console.error('Image compression or upload failed:', err);
      alert(`Image Processing Error: ${err.message || err}`);
      setUploadingIdx(null);
    }
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

      if (error) throw new Error(error.message);

      const { data: publicUrlData } = supabase.storage.from('cms_assets').getPublicUrl(filePath);
      const url = publicUrlData.publicUrl;

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

  // Charity Event Image Upload Handler (Supports Multi-File Upload)
  const handleEventImageUpload = async (idx, files) => {
    if (!files || files.length === 0) return;
    setUploadingIdx(`event-${idx}`);
    const fileList = Array.from(files);

    try {
      const newUrls = [];
      for (const file of fileList) {
        const compressed = await compressToWebP(file);
        const fileName = `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
        const filePath = `${TENANT_ID}/events/${fileName}`;

        const { data, error } = await supabase.storage
          .from('cms_assets')
          .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' });

        if (error) throw new Error(error.message);

        const { data: publicUrlData } = supabase.storage.from('cms_assets').getPublicUrl(filePath);
        newUrls.push(publicUrlData.publicUrl);
      }

      const updatedEvents = [...(cmsSocials.events || [])];
      const existingImages = Array.isArray(updatedEvents[idx].images)
        ? updatedEvents[idx].images
        : (updatedEvents[idx].image ? [updatedEvents[idx].image] : []);

      const combinedImages = [...existingImages, ...newUrls];
      updatedEvents[idx].images = combinedImages;
      updatedEvents[idx].image = combinedImages[0] || '';

      setCmsSocials(prev => ({ ...prev, events: updatedEvents }));
      triggerSaveNotification(`Uploaded ${newUrls.length} event photo(s) successfully!`);
    } catch (err) {
      console.error('Event image upload error:', err);
      alert(`Upload failed: ${err.message || err}`);
    } finally {
      setUploadingIdx(null);
    }
  };

  // Remove individual photo from Event gallery
  const handleRemoveEventImage = (eventIdx, imgIdx) => {
    const updatedEvents = [...(cmsSocials.events || [])];
    const existingImages = Array.isArray(updatedEvents[eventIdx].images)
      ? updatedEvents[eventIdx].images
      : (updatedEvents[eventIdx].image ? [updatedEvents[eventIdx].image] : []);

    existingImages.splice(imgIdx, 1);
    updatedEvents[eventIdx].images = existingImages;
    updatedEvents[eventIdx].image = existingImages[0] || '';

    setCmsSocials(prev => ({ ...prev, events: updatedEvents }));
  };

  const handleSaveSocials = async () => {
    await updateSection('socials', cmsSocials);
    triggerSaveNotification('Socials & Charity Events CMS saved successfully!');
  };

  const handleSaveBranches = async () => {
    await updateSection('branches', cmsBranches);
    triggerSaveNotification('Branch Locations CMS saved successfully!');
  };

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

  useEffect(() => {
    const activeTabObj = navTabs.find(tab => tab.id === activeTab);
    document.title = `Admin | ${activeTabObj ? activeTabObj.name : 'Dashboard'} | Misis Siomai Cebu`;
  }, [activeTab, inquiries]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-900 dark:text-white space-y-4">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Verifying Admin Credentials...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin setSession={setSession} />;
  }


  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col md:flex-row relative`}>

      {/* Sidebar Component */}
      <AdminSidebar
        navTabs={navTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        handleSignOut={handleSignOut}
      />

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
          <AdminInquiriesTab 
            inquiries={inquiries}
            loadingInquiries={loadingInquiries}
            fetchInquiries={fetchInquiries}
            handleUpdateLeadStatus={handleUpdateLeadStatus}
          />
        )}

        {/* TAB 2: SITE IMAGES & LOGOS CMS */}
        {activeTab === 'assets' && (
          <AdminAssetsTab
            cmsAbout={cmsAbout}
            setCmsAbout={setCmsAbout}
            cmsHome={cmsHome}
            setCmsHome={setCmsHome}
            uploadingAssetKey={uploadingAssetKey}
            handleSiteAssetUpload={handleSiteAssetUpload}
            handleSaveAbout={handleSaveAbout}
            handleSaveHome={handleSaveHome}
            triggerSaveNotification={triggerSaveNotification}
            setFullScreenImage={setFullScreenImage}
          />
        )}

        {/* TAB 3: HOME PAGE CMS */}
        {activeTab === 'home' && (
          <AdminHomeTab 
            cmsHome={cmsHome}
            setCmsHome={setCmsHome}
            handleSaveHome={handleSaveHome}
          />
        )}

        {/* TAB 3: ABOUT CMS */}
        {activeTab === 'about' && (
          <AdminAboutTab 
            cmsAbout={cmsAbout}
            setCmsAbout={setCmsAbout}
            handleSaveAbout={handleSaveAbout}
          />
        )}

        {/* TAB 4: PACKAGES CMS */}
        {activeTab === 'packages' && (
          <AdminPackagesTab
            cmsPackages={cmsPackages}
            setCmsPackages={setCmsPackages}
            handleSavePackages={handleSavePackages}
          />
        )}

        {/* TAB 5: PRODUCTS & IMAGES CMS */}
        {activeTab === 'products' && (
          <AdminProductsTab
            cmsProducts={cmsProducts}
            setCmsProducts={setCmsProducts}
            handleSaveProducts={handleSaveProducts}
            handleProductImageUpload={handleProductImageUpload}
            uploadingIdx={uploadingIdx}
            setFullScreenImage={setFullScreenImage}
          />
        )}

        {/* TAB 6: BRANCHES CMS */}
        {activeTab === 'branches' && (
          <AdminBranchesTab
            cmsBranches={cmsBranches}
            setCmsBranches={setCmsBranches}
            handleSaveBranches={handleSaveBranches}
          />
        )}

        {/* TAB 7: SOCIALS & CHARITY EVENTS CMS */}
        {activeTab === 'socials' && (
          <AdminSocialsTab
            cmsSocials={cmsSocials}
            setCmsSocials={setCmsSocials}
            handleSaveSocials={handleSaveSocials}
            handleEventImageUpload={handleEventImageUpload}
            handleRemoveEventImage={handleRemoveEventImage}
            uploadingIdx={uploadingIdx}
            setFullScreenImage={setFullScreenImage}
          />
        )}

        {/* TAB 8: CONTACT & SOCIAL LINKS CMS */}
        {activeTab === 'contact' && (
          <AdminContactTab
            cmsContact={cmsContact}
            setCmsContact={setCmsContact}
            handleSaveContact={handleSaveContact}
          />
        )}

      </main>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-rose-500 rounded-full backdrop-blur-md transition-all cursor-pointer">
            <X className="w-6 h-6" />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Full Screen Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}
