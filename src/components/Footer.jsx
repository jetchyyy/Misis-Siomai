import React from 'react';
import { Utensils, Phone, Mail, MapPin, Flame, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-white">
                Misis<span className="text-rose-500">Siomai</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Ang Paboritong Siomai ng Bayan. Serving authentic 100% pork & beef dimsum daily across 50+ franchise food cart locations nationwide.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Zero Royalty Fees • 100% Real Meat Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-rose-500">Quick Links</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Home Page</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Menu Showcase</a></li>
              <li><a href="#franchise" className="hover:text-white transition-colors">Franchise Packages</a></li>
              <li><a href="#branches" className="hover:text-white transition-colors">Branch Locations</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Franchise Hotline */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-rose-500">Franchise Hotline</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>(02) 8123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+63 917 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>franchise@misissiomai.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Quezon City, Metro Manila, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-rose-500">Head Office Hours</h4>
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-white font-semibold">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-white font-semibold">9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-rose-400 font-semibold">Closed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Misis Siomai Philippines. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-600 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
