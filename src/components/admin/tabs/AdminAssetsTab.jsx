import React, { useState, useEffect } from 'react';
import { Save, ImageIcon, Loader2, Upload } from 'lucide-react';

const ImagePreview = ({ src, fallbackText, onClick }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 w-full h-full absolute inset-0">
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{fallbackText || 'Unavailable'}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt="Preview" 
      className={`max-h-full max-w-full object-contain drop-shadow-xl z-10 ${onClick ? 'cursor-zoom-in hover:scale-105 transition-transform' : ''}`}
      onError={() => setHasError(true)}
      onClick={onClick}
    />
  );
};

export default function AdminAssetsTab({
  cmsAbout,
  setCmsAbout,
  cmsHome,
  setCmsHome,
  uploadingAssetKey,
  handleSiteAssetUpload,
  handleSaveAbout,
  handleSaveHome,
  triggerSaveNotification,
  setFullScreenImage
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Site Images & Logos CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage site logos, navbar branding, hero background, and mascot images with file upload or direct URL</p>
        </div>
        <button
          onClick={async () => {
            await handleSaveAbout();
            await handleSaveHome();
            triggerSaveNotification('All Site Assets saved successfully!');
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer shrink-0 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* 1. Primary Brand Logo */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
          <div className="space-y-3 mb-6 flex-none">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white">Primary Logo</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 h-8 line-clamp-2">Used for Footer, Browser Favicon, and App Splash Screen</p>
          </div>

          <div className="flex-1 flex flex-col justify-end space-y-4">
            <div className="aspect-video rounded-xl bg-gray-50 dark:bg-zinc-950 border border-dashed border-gray-300 dark:border-zinc-700 overflow-hidden relative group flex items-center justify-center p-6">
              <ImagePreview src={cmsAbout.logo_url} fallbackText="No Logo Uploaded" onClick={cmsAbout.logo_url ? () => setFullScreenImage(cmsAbout.logo_url) : null} />
            </div>

            <div className="space-y-1.5 flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Primary Logo URL</label>
              <input
                type="text"
                placeholder="/mississiomai.png or URL"
                value={cmsAbout.logo_url || ''}
                onChange={(e) => setCmsAbout(prev => ({ ...prev, logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800/80 flex-none">
            <label className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'logo' ? 'border-zinc-500 text-zinc-500 cursor-not-allowed' : 'border-gray-200 dark:border-zinc-700 hover:border-rose-500 text-zinc-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-600 dark:text-rose-400'}`}>
              {uploadingAssetKey === 'logo' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
              ) : (
                <><Upload className="w-4 h-4" /><span>Upload Logo Image</span></>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={uploadingAssetKey === 'logo'}
                onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('logo', e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* 2. Navbar Logo */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
          <div className="space-y-3 mb-6 flex-none">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white">Navbar Logo</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 h-8 line-clamp-2">Horizontal logo displayed exclusively in the top navigation bar</p>
          </div>

          <div className="flex-1 flex flex-col justify-end space-y-4">
            <div className="aspect-video rounded-xl bg-gray-50 dark:bg-zinc-950 border border-dashed border-gray-300 dark:border-zinc-700 overflow-hidden relative group flex items-center justify-center p-6">
              <ImagePreview src={cmsAbout.navbar_logo_url} fallbackText="No Navbar Logo" onClick={cmsAbout.navbar_logo_url ? () => setFullScreenImage(cmsAbout.navbar_logo_url) : null} />
            </div>

            <div className="space-y-1.5 flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Navbar Logo URL</label>
              <input
                type="text"
                placeholder="/misissiomailogoside.png or URL"
                value={cmsAbout.navbar_logo_url || ''}
                onChange={(e) => setCmsAbout(prev => ({ ...prev, navbar_logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800/80 flex-none">
            <label className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'navbar_logo' ? 'border-zinc-500 text-zinc-500 cursor-not-allowed' : 'border-gray-200 dark:border-zinc-700 hover:border-rose-500 text-zinc-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-600 dark:text-rose-400'}`}>
              {uploadingAssetKey === 'navbar_logo' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
              ) : (
                <><Upload className="w-4 h-4" /><span>Upload Navbar Logo</span></>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={uploadingAssetKey === 'navbar_logo'}
                onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('navbar_logo', e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* 3. Hero Background Image */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
          <div className="space-y-3 mb-6 flex-none">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white">Hero Background</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 h-8 line-clamp-2">Appears behind the main title on the home page hero section</p>
          </div>

          <div className="flex-1 flex flex-col justify-end space-y-4">
            <div className="aspect-video rounded-xl bg-gray-50 dark:bg-zinc-950 border border-dashed border-gray-300 dark:border-zinc-700 overflow-hidden relative group flex items-center justify-center p-2">
              <ImagePreview src={cmsHome.hero_bg_image} fallbackText="No Background" onClick={cmsHome.hero_bg_image ? () => setFullScreenImage(cmsHome.hero_bg_image) : null} />
            </div>

            <div className="space-y-1.5 flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Hero BG Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={cmsHome.hero_bg_image || ''}
                onChange={(e) => setCmsHome(prev => ({ ...prev, hero_bg_image: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800/80 flex-none">
            <label className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'hero_bg' ? 'border-zinc-500 text-zinc-500 cursor-not-allowed' : 'border-gray-200 dark:border-zinc-700 hover:border-rose-500 text-zinc-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-600 dark:text-rose-400'}`}>
              {uploadingAssetKey === 'hero_bg' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading...</span></>
              ) : (
                <><Upload className="w-4 h-4" /><span>Upload Background</span></>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={uploadingAssetKey === 'hero_bg'}
                onChange={(e) => e.target.files?.[0] && handleSiteAssetUpload('hero_bg', e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* 4. Mascot Image */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
          <div className="space-y-3 mb-6 flex-none">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-base text-zinc-900 dark:text-white">Misis Siomai Mascot</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 h-8 line-clamp-2">Character mascot displayed in the About section</p>
          </div>

          <div className="flex-1 flex flex-col justify-end space-y-4">
            <div className="aspect-video rounded-xl bg-gray-50 dark:bg-zinc-950 border border-dashed border-gray-300 dark:border-zinc-700 overflow-hidden relative group flex items-center justify-center p-4">
              <ImagePreview src={cmsAbout.mascot_image} fallbackText="No Mascot Uploaded" onClick={cmsAbout.mascot_image ? () => setFullScreenImage(cmsAbout.mascot_image) : null} />
            </div>

            <div className="space-y-1.5 flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Mascot Image URL</label>
              <input
                type="text"
                placeholder="/mascot.webp or URL"
                value={cmsAbout.mascot_image || ''}
                onChange={(e) => setCmsAbout(prev => ({ ...prev, mascot_image: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800/80 flex-none">
            <label className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingAssetKey === 'mascot' ? 'border-zinc-500 text-zinc-500 cursor-not-allowed' : 'border-gray-200 dark:border-zinc-700 hover:border-rose-500 text-zinc-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-600 dark:text-rose-400'}`}>
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
          </div>
        </div>

      </div>
    </div>
  );
}
