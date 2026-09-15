import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Socials from '../components/Socials';

export default function SocialsPage({ onOpenFranchiseModal }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-[#cf030f] selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />
        <div className="pt-20">
          <Socials isStandalonePage={true} onOpenFranchiseModal={onOpenFranchiseModal} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
