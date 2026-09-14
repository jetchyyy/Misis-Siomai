import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import LandingPage from './components/LandingPage';
import AboutPage from './pages/AboutPage';
import PackagesPage from './pages/PackagesPage';
import ProductsPage from './pages/ProductsPage';
import BranchesPage from './pages/BranchesPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './components/AdminDashboard';
import InquiryForm from './components/InquiryForm';
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

  return (
    <CMSProvider>
      <Routes>
        <Route path="/" element={<LandingPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/about" element={<AboutPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/packages" element={<PackagesPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/products" element={<ProductsPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/branches" element={<BranchesPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/contact" element={<ContactPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<LandingPage onOpenFranchiseModal={handleOpenFranchiseModal} />} />
      </Routes>

      {/* Global Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-900/10 overflow-hidden max-h-[90vh] overflow-y-auto">
            
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
    </CMSProvider>
  );
}
