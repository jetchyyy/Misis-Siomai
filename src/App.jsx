import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuShowcase from './components/MenuShowcase';
import FranchisePackages from './components/FranchisePackages';
import BranchLocator from './components/BranchLocator';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import { X, Utensils } from 'lucide-react';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInquiryType, setModalInquiryType] = useState('franchise');
  const [selectedPkg, setSelectedPkg] = useState('');

  const handleOpenFranchiseModal = (type = 'franchise', pkgName = '') => {
    setModalInquiryType(type);
    setSelectedPkg(pkgName);
    setModalOpen(true);
  };

  const handleSelectPackage = (pkgName) => {
    handleOpenFranchiseModal('franchise', pkgName);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white">
      
      {/* Top Sticky Header */}
      <Navbar onOpenFranchiseModal={() => handleOpenFranchiseModal('franchise')} />

      {/* Hero Section */}
      <Hero onOpenFranchiseModal={() => handleOpenFranchiseModal('franchise')} />

      {/* Menu Showcase */}
      <MenuShowcase onOpenInquiryModal={(type, pkg) => handleOpenFranchiseModal(type, pkg)} />

      {/* Franchise Packages Comparison */}
      <FranchisePackages onSelectPackage={handleSelectPackage} />

      {/* Branch Locator & Brand Story */}
      <BranchLocator />

      {/* Main Inquiry & Lead Form Section */}
      <InquiryForm
        initialType={modalInquiryType}
        preselectedPackage={selectedPkg}
      />

      {/* Footer */}
      <Footer />

      {/* Modal Popup Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-900/10 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top Bar */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                <span className="font-heading font-extrabold text-base">
                  Misis Siomai Franchise Inquiry
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <InquiryForm
                initialType={modalInquiryType}
                preselectedPackage={selectedPkg}
                onClose={() => setModalOpen(false)}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
