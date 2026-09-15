import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { Phone, Mail, MapPin, Share2, Heart } from 'lucide-react';

export default function Footer() {
  const { cms } = useCMS();
  const { about, contact } = cms;

  return (
    <footer className="bg-[#FAF3E3] text-zinc-800 pt-16 pb-12 border-t-[4px] border-[#cf030f] relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:30px_30px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-[#D4AF37]/40 items-center">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-[#18572c] p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <h3 className="font-serif font-black text-2xl text-[#18572c] tracking-tight drop-shadow-sm">
                  {about.brand_name || 'Misis Siomai Cebu'}
                </h3>
                <p className="text-xs text-[#cf030f] font-black tracking-widest uppercase mt-1">
                  {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details (from Business Card) */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#cf030f] mb-4">Official Management Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-zinc-600">
                <MapPin className="w-3.5 h-3.5 text-[#18572c] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{contact.address || 'Ramona Village, San Isidro, Talisay City, Cebu'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#18572c] shrink-0" />
                <span>{(contact.phones || []).join('  ·  ')}</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-600">
                <Mail className="w-3.5 h-3.5 text-[#18572c] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{(contact.emails || []).join('\n')}</span>
              </div>
              <a
                href={contact.facebook_url || 'https://www.facebook.com/profile.php?id=100028835748373'}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 text-xs text-[#18572c] font-bold hover:text-[#cf030f] transition-colors group"
              >
                <Share2 className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{contact.facebook || 'Misis Siomai Cebu'}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} {about.brand_name || 'Misis Siomai Cebu'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Created by <a href="https://www.facebook.com/odysseysystems" target="_blank" rel="noreferrer" className="text-[#cf030f] hover:text-[#18572c] font-bold transition-colors ml-0.5">Odyssey</a>
          </p>
        </div>

      </div>
    </footer>
  );
}
