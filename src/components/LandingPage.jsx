import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import MenuShowcase from './MenuShowcase';
import FranchisePackages from './FranchisePackages';
import BranchLocator from './BranchLocator';
import Socials from './Socials';
import InquiryForm from './InquiryForm';
import Footer from './Footer';

export default function LandingPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FAF3E3] text-zinc-900 selection:bg-[#cf030f] selection:text-white">
      
      {/* Top Header */}
      <Navbar onOpenFranchiseModal={() => onOpenFranchiseModal('franchise')} />

      {/* Hero Section */}
      <Hero onOpenFranchiseModal={() => onOpenFranchiseModal('franchise')} />

      {/* About Section */}
      <AboutSection />

      {/* Menu Showcase */}
      <MenuShowcase onOpenInquiryModal={(type, pkg) => onOpenFranchiseModal(type, pkg)} />

      {/* Franchise Packages */}
      <FranchisePackages onSelectPackage={(pkg) => onOpenFranchiseModal('franchise', pkg)} />

      {/* Branch Locator & Story */}
      <BranchLocator />

      {/* Social Page */}
      <Socials onOpenFranchiseModal={onOpenFranchiseModal} />

      {/* Main Inquiry Form */}
      <InquiryForm />

      {/* Footer */}
      <Footer />

    </div>
  );
}
