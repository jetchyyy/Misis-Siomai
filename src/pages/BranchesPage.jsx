import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BranchLocator from '../components/BranchLocator';

export default function BranchesPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />
        <div className="pt-24">
          <BranchLocator />
        </div>
      </div>
      <Footer />
    </div>
  );
}
