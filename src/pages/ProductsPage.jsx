import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuShowcase from '../components/MenuShowcase';

export default function ProductsPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />
        <div className="pt-24">
          <MenuShowcase onOpenInquiryModal={(type, pkg) => onOpenFranchiseModal(type, pkg)} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
