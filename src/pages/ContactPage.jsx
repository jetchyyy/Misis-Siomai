import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryForm from '../components/InquiryForm';
import { useCMS } from '../context/CMSContext';
import { Phone, Mail, MapPin, User, Clock, Share2 } from 'lucide-react';

export default function ContactPage({ onOpenFranchiseModal }) {
  const { cms } = useCMS();
  const { contact } = cms;

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />
        
        <div className="pt-28 pb-16">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Official Contact Directory
              </span>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl">
                Get In Touch With <span className="text-amber-300">{cms.about.brand_name || 'Misis Siomai Cebu'}</span>
              </h1>
              <p className="text-rose-100 text-sm sm:text-base max-w-xl mx-auto">
                Reach out to our General Manager and Franchise Development team for package details, supply inquiries, and ROI projections.
              </p>
            </div>
          </div>

          {/* Contact Business Card Display */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="p-8 rounded-3xl bg-white border border-rose-900/10 shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-100 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">General Manager</span>
                  <h2 className="font-heading font-extrabold text-2xl text-zinc-900 mt-1">
                    {contact.general_manager || 'Lendice Marie A. Cal'}
                  </h2>
                  <p className="text-xs text-zinc-500 font-semibold">{cms.about.brand_name || 'Misis Siomai Cebu'}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">{contact.operating_hours || 'Mon-Sat: 8:00 AM - 6:00 PM'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Location */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                    <MapPin className="w-4 h-4" /> Location
                  </div>
                  <p className="text-sm font-semibold text-zinc-800">{contact.address}</p>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                    <Phone className="w-4 h-4" /> Phone Numbers
                  </div>
                  {(contact.phones || []).map((ph, idx) => (
                    <a key={idx} href={`tel:${ph.replace(/\s+/g, '')}`} className="block text-sm font-semibold text-emerald-700 hover:underline">
                      {ph}
                    </a>
                  ))}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                    <Mail className="w-4 h-4" /> Email Addresses
                  </div>
                  {(contact.emails || []).map((em, idx) => (
                    <a key={idx} href={`mailto:${em}`} className="block text-xs font-semibold text-zinc-700 hover:text-rose-600 hover:underline truncate">
                      {em}
                    </a>
                  ))}
                </div>

                {/* Social */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                    <Share2 className="w-4 h-4" /> Facebook Page
                  </div>
                  <a 
                    href={contact.facebook_url || 'https://www.facebook.com/profile.php?id=100028835748373'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {contact.facebook || 'Misis Siomai Cebu'}
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Form */}
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
