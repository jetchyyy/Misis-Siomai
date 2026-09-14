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
import SplashScreen from './components/SplashScreen';
import { X, MessageCircleQuestion } from 'lucide-react';
import ChatWidget from './components/ChatWidget';

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
      <SplashScreen>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Sticky Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#18572c] to-emerald-700 text-white flex items-center justify-between rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 border border-white/20 p-1.5 rounded-lg shrink-0">
                  <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">— Misis Siomai Cebu —</p>
                  <h2 className="font-serif font-black text-base leading-tight text-white">Franchise Inquiry Form</h2>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto flex-1 p-6">
              <InquiryForm
                initialType={modalInquiryType}
                preselectedPackage={selectedPkg}
                onClose={() => setModalOpen(false)}
                isModal={true}
              />
            </div>

          </div>
        </div>
      )}
      {/* Interactive Chat Widget */}
      <ChatWidget />

      </SplashScreen>
    </CMSProvider>
  );
}
