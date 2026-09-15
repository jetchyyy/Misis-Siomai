import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Store } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import navLogo from '../assets/misissiomailogoside.png';

export default function Navbar({ onOpenFranchiseModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const { cms } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Simple scroll spy
      const sections = ['hero', 'about', 'menu', 'franchise', 'branches', 'socials', 'contact'];
      let current = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 100)) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Products', id: 'menu' },
    { name: 'Packages', id: 'franchise' },
    { name: 'Branches', id: 'branches' },
    { name: 'Socials', id: 'socials' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const phonePrimary = cms.contact?.phones?.[0] || '0932 2329484';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-t-4 border-[#cf030f] ${
      scrolled ? 'bg-[#18572c]/95 backdrop-blur-md py-3 shadow-xl border-b border-[#d4af37]/30' : 'bg-[#18572c] py-4 border-b border-[#18572c]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="flex flex-col items-start gap-0.5 group">
            <img src={cms.about?.navbar_logo_url || navLogo} alt="Misis Siomai Cebu Logo" className="h-10 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-md object-contain" />
            <p className="text-[9px] font-bold text-[#d4af37] tracking-wider uppercase drop-shadow-sm ml-1">
              {cms.about?.tagline || 'Ang Paboritong Siomai ng Bayan'}
            </p>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className={`text-sm font-bold uppercase tracking-wider transition-all duration-200 py-1 border-b-2 cursor-pointer ${
                    isActive 
                      ? 'text-[#d4af37] border-[#d4af37]' 
                      : 'text-zinc-100 hover:text-[#d4af37] border-transparent'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenFranchiseModal}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#cf030f] hover:bg-[#a5020c] text-white font-bold text-sm shadow-lg shadow-[#cf030f]/30 hover:shadow-[#cf030f]/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-[#cf030f]"
            >
              <Store className="w-4 h-4" />
              <span>Franchise Now</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#113d1e] text-white hover:bg-[#0a2612] transition-colors border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18572c] border-b border-[#d4af37]/30 px-4 pt-4 pb-6 mt-3 space-y-2 shadow-2xl absolute w-full left-0">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.id}`}
              onClick={(e) => handleScrollTo(e, link.id)}
              className="block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-white hover:bg-[#113d1e] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3 px-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFranchiseModal) onOpenFranchiseModal();
              }}
              className="w-full py-3 rounded-full bg-[#cf030f] text-white font-bold text-sm shadow-md shadow-[#cf030f]/30 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              Franchise Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
