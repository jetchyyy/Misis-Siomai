import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FranchisePackages from '../components/FranchisePackages';
import { useCMS } from '../context/CMSContext';

export default function PackagesPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />
        <div className="pt-24">
          <FranchisePackages onSelectPackage={(pkgName) => onOpenFranchiseModal('franchise', pkgName)} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
