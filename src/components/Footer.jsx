import React from 'react';
import { Link } from 'react-router-dom';
import MisisSiomaiLogo from './MisisSiomaiLogo';
import { useCMS } from '../context/CMSContext';
import { Phone, Mail, MapPin, Share2, Heart } from 'lucide-react';

export default function Footer() {
  const { cms } = useCMS();
  const { about, contact } = cms;

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <MisisSiomaiLogo className="w-10 h-10" />
              <div>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  {about.brand_name || 'Misis Siomai Cebu'}
                </h3>
                <p className="text-xs text-amber-400 font-bold tracking-wide uppercase">
                  {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {about.story}
            </p>
          </div>

          {/* Quick Page Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-400">
              <li><Link to="/" className="hover:text-rose-400 transition-colors">Home Page</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Us (Mission & Vision)</Link></li>
              <li><Link to="/packages" className="hover:text-rose-400 transition-colors">Franchise Packages</Link></li>
              <li><Link to="/products" className="hover:text-rose-400 transition-colors">Products & Menu</Link></li>
              <li><Link to="/branches" className="hover:text-rose-400 transition-colors">Branch Locations</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Official Contact Directory</Link></li>
              <li><Link to="/admin" className="hover:text-rose-400 transition-colors text-amber-400 font-bold">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details (from Business Card) */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">Official Management Contact</h4>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
              <p className="font-bold text-rose-400 text-sm">
                General Manager: <span className="text-white">{contact.general_manager || 'Lendice Marie A. Cal'}</span>
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-amber-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{(contact.phones || []).join(' / ')}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{(contact.emails || []).join(' / ')}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold pt-1">
                <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={contact.facebook_url || 'https://facebook.com/MisisSiomaiCebu'} target="_blank" rel="noreferrer" className="hover:underline">
                  {contact.facebook || 'Misis Siomai Cebu'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {about.brand_name || 'Misis Siomai Cebu'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Filipino Entrepreneurs
          </p>
        </div>

      </div>
    </footer>
  );
}
