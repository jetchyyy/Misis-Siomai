import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronRight } from 'lucide-react';
import MisisSiomaiLogo from './MisisSiomaiLogo';
import { useCMS } from '../context/CMSContext';

export default function Navbar({ onOpenFranchiseModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cms } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Products', path: '/products' },
    { name: 'Branches', path: '/branches' },
    { name: 'Contact', path: '/contact' },
  ];

  const phonePrimary = cms.contact.phones[0] || '0932 2329484';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-lg shadow-rose-950/5 py-3 border-b border-rose-900/10' : 'bg-[#FFFDF7]/90 backdrop-blur-md py-4 border-b border-rose-900/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <MisisSiomaiLogo className="w-11 h-11 group-hover:scale-105 transition-transform duration-300" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-zinc-900">
                  {cms.about.brand_name || 'Misis Siomai Cebu'}
                </span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 tracking-wide uppercase">
                {cms.about.tagline || 'Ang Paboritong Siomai ng Bayan'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 py-1 border-b-2 ${
                    isActive 
                      ? 'text-rose-600 border-rose-600' 
                      : 'text-zinc-700 hover:text-rose-600 border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={`tel:${phonePrimary.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{phonePrimary}</span>
            </a>

            <button
              onClick={onOpenFranchiseModal}
              className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-heading font-bold text-xs shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Franchise Now
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-rose-900/10 px-4 pt-4 pb-6 mt-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-800 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-200/60 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFranchiseModal) onOpenFranchiseModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-heading font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              Franchise Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
