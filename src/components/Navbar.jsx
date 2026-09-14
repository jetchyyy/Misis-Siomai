import React, { useState, useEffect } from 'react';
import { Utensils, Phone, Flame, Menu, X, ChevronRight, Award } from 'lucide-react';

export default function Navbar({ onOpenFranchiseModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Menu Showcase', href: '#menu' },
    { name: 'Franchise Packages', href: '#franchise' },
    { name: 'Branches & Locations', href: '#branches' },
    { name: 'Contact & Inquiry', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-lg shadow-rose-950/5 py-3 border-b border-rose-900/10' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-zinc-900">
                  Misis<span className="text-rose-600">Siomai</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/50">
                  <Flame className="w-3 h-3 text-amber-600 mr-0.5" />
                  PREMIUM
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-500 tracking-wide uppercase">Ang Paboritong Siomai ng Bayan</p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-zinc-700 hover:text-rose-600 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:+639171234567" 
              className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-rose-600 transition-colors px-3 py-2"
            >
              <Phone className="w-4 h-4 text-rose-600" />
              <span>(02) 8123-4567</span>
            </a>
            <button
              onClick={onOpenFranchiseModal}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-heading font-bold text-sm shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Franchise Now
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-rose-900/10 px-4 pt-4 pb-6 mt-3 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-800 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-200/60 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFranchiseModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-heading font-bold text-base shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              Franchise Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
