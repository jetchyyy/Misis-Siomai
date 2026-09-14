import React, { useState } from 'react';
import { Target, Compass, Heart, Shield, Users, TrendingUp, Handshake, CheckCircle2, Star } from 'lucide-react';
import mascotImg from '../assets/mascot.webp';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('profile');

  const coreValues = [
    { icon: <Star className="w-5 h-5" />, title: 'Quality', desc: 'We strive to provide products that customers can enjoy and trust.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Affordability', desc: 'We believe good food should be accessible to everyone.' },
    { icon: <Heart className="w-5 h-5" />, title: 'Customer Service', desc: 'We value every customer and aim to provide a positive dining experience.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Integrity', desc: 'We conduct our business with honesty, responsibility, and professionalism.' },
    { icon: <Users className="w-5 h-5" />, title: 'Entrepreneurship', desc: 'We create opportunities for individuals who want to build their own small business.' },
  ];

  // Chinese Fretwork Corner SVG
  const FretworkCorner = ({ className }) => (
    <svg className={className} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 49 V 15 H 15 V 1 H 49" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8" />
      <path d="M9 41 V 23 H 23 V 9 H 41" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="1" y="1" width="14" height="14" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );

  return (
    <section id="about" className="py-20 md:py-32 bg-[#FAF3E3] relative overflow-hidden border-y border-[#D4AF37]/20">

      {/* Full-width Inner Border Frame */}
      <div className="absolute inset-3 md:inset-6 border border-[#D4AF37]/30 pointer-events-none z-0"></div>

      {/* 4 Decorative Corners Pinned to Section Edges */}
      <div className="absolute top-2 left-2 md:top-5 md:left-5"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16" /></div>
      <div className="absolute top-2 right-2 md:top-5 md:right-5"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-90" /></div>
      <div className="absolute bottom-2 right-2 md:bottom-5 md:right-5"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-180" /></div>
      <div className="absolute bottom-2 left-2 md:bottom-5 md:left-5"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 -rotate-90" /></div>

      {/* Dotted border accents */}
      <div className="absolute bottom-12 right-12 md:bottom-20 md:right-20 w-32 h-32 border-r-4 border-b-4 border-dotted border-[#cf030f]/60 opacity-60 hidden md:block"></div>
      <div className="absolute top-12 left-12 md:top-20 md:left-20 w-32 h-32 border-l-4 border-t-4 border-dotted border-[#cf030f]/60 opacity-30 hidden md:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

        {/* Custom Tabs Navigation */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-16 relative z-10">
          {[
            { id: 'profile', label: 'Company Profile' },
            { id: 'mission', label: 'Mission & Vision' },
            { id: 'values', label: 'Core Values' },
            { id: 'milestones', label: 'Milestones & Commitment' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${activeTab === tab.id
                  ? 'bg-[#18572c] text-white border-[#18572c] shadow-md'
                  : 'bg-transparent text-zinc-600 border-transparent hover:bg-black/5 hover:text-zinc-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full relative z-10 min-h-[400px]">

          {/* Tab Content: Profile */}
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-12 gap-12 items-center animate-fade-in">
              <div className="md:col-span-7 space-y-6 text-zinc-700 text-base md:text-lg leading-relaxed">
                <h2 className="font-heading font-black text-4xl md:text-5xl text-zinc-900 mb-6 leading-tight">
                  About Misis Siomai
                </h2>
                <p>
                  <strong className="text-[#18572c] font-serif text-xl tracking-wide">Misis Siomai Cebu</strong> is a proudly local food brand specializing in delicious, affordable, and satisfying siomai products made for Filipino families, students, workers, and food lovers.
                </p>
                <p>
                  Established in 2021, Misis Siomai Cebu started from humble beginnings with a simple goal: to serve quality and flavorful siomai at an affordable price while creating opportunities for aspiring entrepreneurs.
                </p>
                <p>
                  From a small beginning, the brand continues to grow through its products, customer-focused service, and business partnership opportunities.
                </p>

                <div className="pt-6">
                  <button
                    onClick={() => document.getElementById('franchise')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[#18572c] hover:bg-[#113d1e] text-white px-10 py-3.5 rounded-full font-bold transition-colors shadow-lg shadow-[#18572c]/30 hover:-translate-y-0.5"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 relative flex justify-center mt-10 md:mt-0">
                <div className="relative w-full max-w-sm">
                  {/* Shadow backdrop to make the mascot pop */}
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-3xl transform translate-y-10 scale-90"></div>
                  <img
                    src={mascotImg}
                    alt="Misis Siomai Mascot"
                    className="relative z-10 w-full h-auto object-contain rounded-3xl mix-blend-multiply"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Mission & Vision */}
          {activeTab === 'mission' && (
            <div className="grid md:grid-cols-2 gap-10 animate-fade-in">

              {/* Vision Box */}
              <div className="bg-white/60 p-8 rounded-3xl shadow-sm border border-[#D4AF37]/30 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#18572c]/10 text-[#18572c] rounded-2xl flex items-center justify-center mb-6">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-3xl text-zinc-900 mb-4">Our Vision</h3>
                <p className="text-zinc-700 text-lg leading-relaxed">
                  To become a trusted and recognized local food brand in Cebu and eventually expand to more communities across the Philippines.
                </p>
              </div>

              {/* Mission Box */}
              <div className="bg-[#18572c] p-8 rounded-3xl shadow-xl text-white flex flex-col">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif font-black text-3xl text-[#d4af37] mb-4">Our Mission</h3>
                <p className="text-zinc-100 text-lg leading-relaxed mb-6">
                  To provide delicious and affordable food while building sustainable business opportunities for aspiring entrepreneurs and families.
                </p>
                <div className="space-y-3 mt-auto">
                  <h4 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-3">We aim to:</h4>
                  {[
                    'Maintain consistent product quality',
                    'Provide excellent customer service',
                    'Offer affordable and accessible food products',
                    'Develop profitable business opportunities',
                    'Support aspiring entrepreneurs through franchising',
                    'Continuously innovate our products and services'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab Content: Core Values */}
          {activeTab === 'values' && (
            <div className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreValues.map((val, idx) => (
                  <div key={idx} className="bg-white/60 p-6 rounded-2xl shadow-sm border border-[#D4AF37]/30 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#18572c]/10 text-[#18572c] rounded-xl flex items-center justify-center mb-4">
                      {val.icon}
                    </div>
                    <h4 className="font-heading font-black text-xl text-zinc-900 mb-2 uppercase tracking-wide">{val.title}</h4>
                    <p className="text-zinc-700 leading-relaxed text-sm">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Milestones */}
          {activeTab === 'milestones' && (
            <div className="grid md:grid-cols-2 gap-12 animate-fade-in">

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#cf030f] before:via-[#18572c] before:to-transparent">

                {/* 2021 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FAF3E3] bg-[#cf030f] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white z-10">
                    <span className="text-xs font-bold">2021</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white/60 shadow-sm border border-[#D4AF37]/30">
                    <h4 className="font-bold text-[#18572c] text-lg mb-1">Humble Beginnings</h4>
                    <p className="text-sm text-zinc-700">Misis Siomai Cebu began its journey with a simple food business concept.</p>
                  </div>
                </div>

                {/* 2026 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FAF3E3] bg-[#18572c] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white z-10">
                    <span className="text-xs font-bold">2026</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white/60 shadow-sm border border-[#D4AF37]/30">
                    <h4 className="font-bold text-[#18572c] text-lg mb-1">Growing the Brand</h4>
                    <p className="text-sm text-zinc-700 mb-3">The brand continues to expand its products, business operations, and partnership opportunities.</p>
                    <p className="text-xs text-zinc-600 italic border-l-2 border-[#cf030f] pl-3 py-1">The opening of its first franchised store at Humayan Foodie Market, Minglanilla, Cebu marked an important milestone in the brand's franchising journey.</p>
                  </div>
                </div>

              </div>

              {/* Opportunity & Commitment */}
              <div className="space-y-6">
                <div className="bg-[#18572c] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Handshake className="w-32 h-32" /></div>
                  <h4 className="font-serif font-black text-2xl text-[#d4af37] mb-3 relative z-10">Our Business Opportunity</h4>
                  <p className="text-sm text-zinc-100 leading-relaxed mb-3 relative z-10">Misis Siomai Cebu is developing its business through franchising and negosyo opportunities, allowing qualified partners to operate their own Misis Siomai business.</p>
                  <p className="text-sm text-zinc-100 leading-relaxed relative z-10">Our goal is not only to sell siomai but also to help create livelihood opportunities and aspiring entrepreneurs through a practical food business model.</p>
                </div>

                <div className="bg-white/60 border border-[#D4AF37]/30 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-serif font-black text-2xl text-[#cf030f] mb-3">Our Commitment</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mb-3">Misis Siomai Cebu believes that a successful food business is built through quality products, affordable pricing, good customer service, and strong partnerships.</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">We continue to improve our operations and develop opportunities that can help our business partners grow together with the brand.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
