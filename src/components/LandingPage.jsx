import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import MenuShowcase from './MenuShowcase';
import FranchisePackages from './FranchisePackages';
import BranchLocator from './BranchLocator';
import InquiryForm from './InquiryForm';
import Footer from './Footer';

export default function LandingPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white">
      
      {/* Top Header */}
      <Navbar onOpenFranchiseModal={() => onOpenFranchiseModal('franchise')} />

      {/* Hero Section */}
      <Hero onOpenFranchiseModal={() => onOpenFranchiseModal('franchise')} />

      {/* Menu Showcase */}
      <MenuShowcase onOpenInquiryModal={(type, pkg) => onOpenFranchiseModal(type, pkg)} />

      {/* Franchise Packages */}
      <FranchisePackages onSelectPackage={(pkg) => onOpenFranchiseModal('franchise', pkg)} />

      {/* Branch Locator & Story */}
      <BranchLocator />

      {/* Main Inquiry Form */}
      <InquiryForm />

      {/* Footer */}
      <Footer />

    </div>
  );
}
