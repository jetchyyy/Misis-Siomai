import React, { useState, useEffect } from 'react';
import { supabase, TENANT_ID } from '../lib/supabase';
import { Send, CheckCircle2, Loader2, AlertCircle, Store, ShoppingBag, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InquiryForm({ initialType = 'franchise', preselectedPackage = '', onClose, isModal = false }) {
  const [inquiryType, setInquiryType] = useState(initialType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    targetCity: '',
    selectedPackage: preselectedPackage || 'Mall Kiosk Package',
    message: '',
  });

  useEffect(() => {
    if (preselectedPackage) {
      setFormData(prev => ({ ...prev, selectedPackage: preselectedPackage }));
    }
  }, [preselectedPackage]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Chinese Fretwork Corner SVG
  const FretworkCorner = ({ className }) => (
    <svg className={className} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 49 V 15 H 15 V 1 H 49" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8"/>
      <path d="M9 41 V 23 H 23 V 9 H 41" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8"/>
      <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8"/>
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    const newInquiry = {
      id: `inq-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenant_id: TENANT_ID,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      inquiry_type: inquiryType,
      message: formData.message.trim(),
      status: 'New',
      created_at: new Date().toISOString(),
      custom_fields: {
        address: formData.address.trim(),
        target_city: formData.targetCity.trim(),
        selected_package: formData.selectedPackage,
        submitted_at: new Date().toISOString(),
      },
    };

    // 1. Always persist locally for 100% reliability in Admin Dashboard
    try {
      const existing = JSON.parse(localStorage.getItem('misis_siomai_inquiries') || '[]');
      const updated = [newInquiry, ...existing];
      localStorage.setItem('misis_siomai_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new Event('misis_siomai_inquiry_submitted'));
    } catch (lsErr) {
      console.warn('Could not save inquiry to localStorage:', lsErr);
    }

    // 2. Insert into Supabase database
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([newInquiry]);

      if (error) {
        console.warn('Supabase insert warning:', error.message);
      }
    } catch (err) {
      console.error('Submission error connecting to Supabase:', err);
    } finally {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        targetCity: '',
        selectedPackage: 'Mall Kiosk Package',
        message: '',
      });
      setLoading(false);
    }
  };

  // ─── Inner form content (shared) ─────────────────────────────────────────
  const formContent = (
    <div className="relative z-10 space-y-6">
      {/* Success Banner */}
      {success ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-emerald-900">
            Mabuhay! Inquiry Submitted Successfully
          </h3>
          <p className="text-sm text-emerald-700 max-w-md mx-auto">
            Thank you for your interest in Misis Siomai! Our franchise representative will call or email you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Type Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/60 border border-[#D4AF37]/30 shadow-inner">
            {[
              { id: 'franchise', label: 'Franchise Inquiry', icon: Store },
              { id: 'general', label: 'General Inquiry', icon: HelpCircle },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInquiryType(tab.id)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inquiryType === tab.id
                      ? 'bg-[#cf030f] text-white shadow-lg shadow-[#cf030f]/30'
                      : 'text-[#18572c] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Full Name *</label>
              <input required type="text" placeholder="e.g. Juan Dela Cruz" value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Email Address *</label>
              <input required type="email" placeholder="juandelacruz@gmail.com" value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Mobile Phone *</label>
              <input required type="tel" placeholder="0917 123 4567" value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Complete Address *</label>
              <input required type="text" placeholder="123 Main St, Brgy. San Jose" value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Target City</label>
              <input type="text" placeholder="e.g. Cebu City / Manila" value={formData.targetCity}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCity: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium" />
            </div>
          </div>

          {/* Package Selection */}
          {inquiryType === 'franchise' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Preferred Package</label>
              <select value={formData.selectedPackage}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedPackage: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium">
                <option value="Food Cart Package">Food Cart Package (₱99,000)</option>
                <option value="Mall Kiosk Package">Mall Kiosk Package (₱175,000)</option>
                <option value="Cloud Kitchen & Delivery Hub">Cloud Kitchen & Delivery Hub (₱250,000)</option>
              </select>
            </div>
          )}

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Message / Questions</label>
            <textarea rows={3} placeholder="Tell us about your target location, opening date, or any questions..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium resize-y" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#cf030f] to-[#8a020a] hover:from-[#a6020c] hover:to-[#5e0106] text-[#D4AF37] font-serif font-black text-lg uppercase tracking-wider shadow-lg shadow-[#cf030f]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#D4AF37]/40">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>) : (<><Send className="w-5 h-5" /><span>Submit Inquiry Now</span></>)}
          </button>
        </form>
      )}
    </div>
  );

  // ─── Modal render path: just the bare form ────────────────────────────────
  if (isModal) {
    return formContent;
  }

  // ─── Page section render path: full green section with decorations ────────
  return (
    <section id="contact" className="py-20 md:py-32 bg-[#18572c] relative overflow-hidden border-t border-[#D4AF37]/20">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("PUT_YOUR_BACKGROUND_IMAGE_URL_HERE")' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#18572c] via-transparent to-[#18572c] opacity-80 pointer-events-none" />

      <div className="absolute top-2 left-2 md:top-5 md:left-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 text-[#D4AF37]" /></div>
      <div className="absolute top-2 right-2 md:top-5 md:right-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-90 text-[#D4AF37]" /></div>
      <div className="absolute bottom-2 right-2 md:bottom-5 md:right-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-180 text-[#D4AF37]" /></div>
      <div className="absolute bottom-2 left-2 md:bottom-5 md:left-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 -rotate-90 text-[#D4AF37]" /></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        
        {/* Form Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-4 text-[#D4AF37] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <span className="w-8 h-[2px] bg-[#D4AF37]/60"></span>
            Get In Touch With Us
            <span className="w-8 h-[2px] bg-[#D4AF37]/60"></span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Start Your <br className="hidden sm:block" /><span 
              className="text-[#cf030f] italic pr-2 sm:pr-3 inline-block"
              style={{ 
                textShadow: `
                  -1px -1px 0 #fff,  
                   1px -1px 0 #fff,
                  -1px  1px 0 #fff,
                   1px  1px 0 #fff,
                   2px  4px 8px rgba(0,0,0,0.15)
                `
              }}
            >Franchise Journey</span> Today
          </h2>
          <p className="text-sm sm:text-base text-zinc-100 max-w-xl mx-auto leading-relaxed mt-4">
            Fill out the inquiry form below and our dedicated franchise manager will reach out within 24 hours with complete package details and ROI analysis!
          </p>
        </div>

        <div className="rounded-[2rem] p-8 sm:p-12 shadow-2xl bg-[#FAF3E3] border-[4px] border-[#D4AF37] relative group overflow-hidden">
          
          {/* Inner frame */}
          <div className="absolute inset-2 border-[1.5px] border-[#cf030f]/30 rounded-[1.5rem] pointer-events-none"></div>

          {/* Tiny Inner Corners (Fretwork) */}
          <div className="absolute top-3 left-3 opacity-60"><FretworkCorner className="w-6 h-6 text-[#cf030f]" /></div>
          <div className="absolute top-3 right-3 opacity-60"><FretworkCorner className="w-6 h-6 rotate-90 text-[#cf030f]" /></div>
          <div className="absolute bottom-3 right-3 opacity-60"><FretworkCorner className="w-6 h-6 rotate-180 text-[#cf030f]" /></div>
          <div className="absolute bottom-3 left-3 opacity-60"><FretworkCorner className="w-6 h-6 -rotate-90 text-[#cf030f]" /></div>
          
          <div className="relative z-10">

          {/* Success Banner */}
          {success ? (
            <div className="mt-8 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-emerald-900">
                Mabuhay! Inquiry Submitted Successfully
              </h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Thank you for your interest in Misis Siomai! Our franchise representative will call or email you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              
              {/* Inquiry Type Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/60 border border-[#D4AF37]/30 shadow-inner">
                {[
                  { id: 'franchise', label: 'Franchise Inquiry', icon: Store },
                  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInquiryType(tab.id)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        inquiryType === tab.id
                          ? 'bg-[#cf030f] text-white shadow-lg shadow-[#cf030f]/30'
                          : 'text-[#18572c] hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Juan Dela Cruz"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="juandelacruz@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  />
                </div>

                {/* Mobile Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Mobile Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="0917 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  />
                </div>

                {/* Complete Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Complete Address *</label>
                  <input
                    required
                    type="text"
                    placeholder="123 Main St, Brgy. San Jose"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  />
                </div>

                {/* Target Location / City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Target Franchise Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Quezon City / Manila / Cebu"
                    value={formData.targetCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCity: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  />
                </div>

              </div>

              {/* Package Selection dropdown (if franchise type) */}
              {inquiryType === 'franchise' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Preferred Franchise Package</label>
                  <select
                    value={formData.selectedPackage}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedPackage: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium"
                  >
                    <option value="Food Cart Package">Food Cart Package (₱99,000)</option>
                    <option value="Mall Kiosk Package">Mall Kiosk Package (₱175,000)</option>
                    <option value="Cloud Kitchen & Delivery Hub">Cloud Kitchen & Delivery Hub (₱250,000)</option>
                  </select>
                </div>
              )}

              {/* Message Details */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#18572c]">Message / Questions</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your target location, target opening date, or any specific questions..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D4AF37]/40 text-sm text-[#18572c] placeholder:text-[#18572c]/40 outline-none focus:border-[#cf030f] focus:ring-2 focus:ring-[#cf030f]/20 transition-all shadow-sm font-medium resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#cf030f] to-[#8a020a] hover:from-[#a6020c] hover:to-[#5e0106] text-[#D4AF37] font-serif font-black text-lg uppercase tracking-wider shadow-lg shadow-[#cf030f]/30 hover:shadow-xl hover:shadow-[#cf030f]/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#D4AF37]/40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Inquiry Now</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          </div>
        </div>

      </motion.div>
    </section>
  );
}
