import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  MessageSquare,
  ChevronRight,
  Award
} from 'lucide-react';

const defaultEvents = [
  {
    id: 'event-1',
    title: 'Kusina ng Bayan: Metro Cebu Feeding Drive',
    category: 'Feeding Program',
    date: 'Community Initiative',
    location: 'Talisay City & Colon, Cebu',
    impact: 'Community Feeding Drive',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    description: 'Misis Siomai Cebu organized a community feeding initiative bringing freshly steamed 100% pure pork siomai rice meals and clean drinking water to children, street vendors, and jeepney drivers across Talisay and Downtown Cebu City.',
    highlights: [
      'Freshly cooked siomai rice bowls prepared by Misis Siomai team',
      'Partnered with local barangay volunteers in Talisay',
      'Distributed hygiene kits and bottled beverages'
    ],
    quote: '"Seeing the bright smiles of our youth as they enjoyed a warm meal reminded us why Misis Siomai is truly Ang Paboritong Siomai ng Bayan."'
  },
  {
    id: 'event-2',
    title: 'Project Balik-Eskwela: School Kits & Dimsum',
    category: 'Youth & Education',
    date: 'School Outreach',
    location: 'San Isidro Elementary School, Cebu',
    impact: 'Youth Education Drive',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    description: 'Supporting education for underprivileged elementary students. Misis Siomai distributed brand-new backpacks filled with notebooks, writing materials, and delicious dimsum snack packs for young learners preparing for the school year.',
    highlights: [
      'Durable backpacks with complete school supplies',
      'Nutritious dimsum merienda for students and teachers',
      'Special fun games & activities led by the Misis Siomai crew'
    ],
    quote: '"Education changes lives. We are committed to nourishing both the bodies and minds of our future leaders."'
  },
  {
    id: 'event-3',
    title: 'Typhoon & Emergency Calamity Relief',
    category: 'Disaster Relief',
    date: 'Relief Operation',
    location: 'Coastal Barangays in Metro Cebu',
    impact: 'Emergency Relief Operation',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
    description: 'When heavy monsoon floods affected coastal families in Metro Cebu, the Misis Siomai mobile team mobilized emergency aid packages containing essential food supplies, clean water, and instant siomai packs to assist displaced households.',
    highlights: [
      'Family relief packages containing rice & essential food goods',
      'Direct emergency dispatch to remote coastal communities',
      'On-the-ground volunteer relief coordination'
    ],
    quote: '"In times of calamity, Bayanihan is our strongest pillar. Misis Siomai will always stand by our Cebuano families."'
  },
  {
    id: 'event-4',
    title: 'Dimsum Salute to Night Shift Frontliners',
    category: 'Community Outreach',
    date: 'Frontliner Support',
    location: 'Cebu City Hospitals & Emergency Units',
    impact: 'Frontliner Appreciation',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    description: 'A midnight food delivery honoring night-shift healthcare workers, sanitation teams, and emergency responders who work tirelessly while the rest of the city sleeps.',
    highlights: [
      'Hot siomai platters & chili oil packs delivered to local hospitals',
      'Handwritten appreciation cards from the Misis Siomai team',
      'Special discount vouchers for frontliners and their families'
    ],
    quote: '"Our frontliners work around the clock to keep us safe. Giving them a delicious hot meal is our simple way of saying Daghang Salamat!"'
  }
];

export default function Socials({ isStandalonePage = false, onOpenFranchiseModal }) {
  const { cms } = useCMS();
  const contact = cms.contact || {};

  // Selected event for modal view
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Active category filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Decorative Chinese Fretwork Corner Component
  const FretworkCorner = ({ className }) => (
    <svg className={className} width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 49 V 15 H 15 V 1 H 49" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <path d="M9 41 V 23 H 23 V 9 H 41" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );

  // Events data binding from CMS Context
  const charityEvents = cms.socials?.events && cms.socials.events.length > 0
    ? cms.socials.events
    : defaultEvents;

  const categories = ['All', ...Array.from(new Set(charityEvents.map(e => e.category || 'General')))];

  const filteredEvents = activeCategory === 'All'
    ? charityEvents
    : charityEvents.filter(e => e.category === activeCategory);

  return (
    <section id="socials" className={`relative bg-[#FAF3E3] overflow-hidden ${isStandalonePage ? 'py-12 md:py-20' : 'py-20 md:py-28'} border-t border-[#D4AF37]/30`}>
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#18572c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      {/* Decorative Outer Border Corners */}
      <div className="absolute top-4 left-4 hidden sm:block pointer-events-none opacity-40"><FretworkCorner className="w-10 h-10 text-[#18572c]" /></div>
      <div className="absolute top-4 right-4 hidden sm:block pointer-events-none opacity-40"><FretworkCorner className="w-10 h-10 rotate-90 text-[#18572c]" /></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">

          <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#18572c] tracking-tight leading-tight">
            Misis Siomai <br className="hidden sm:inline" />
            <span
              className="text-[#cf030f] italic pr-2 inline-block"
              style={{
                textShadow: `
                  -1px -1px 0 #fff,  
                   1px -1px 0 #fff,
                  -1px  1px 0 #fff,
                   1px  1px 0 #fff,
                   2px 4px 8px rgba(0,0,0,0.12)
                `
              }}
            >
              Charity & Community Outreach
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-700 leading-relaxed font-medium">
            Beyond serving 100% pure meat dimsum, our heart lies in uplifting Cebuano families.
            Through feeding programs, school kit drives, and disaster relief, we share our blessings with the community.
          </p>
        </div>

        {/* Category Filtering Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer border ${activeCategory === cat
                ? 'bg-[#18572c] text-[#D4AF37] border-[#18572c] shadow-lg shadow-[#18572c]/20'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#18572c] hover:text-[#18572c]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredEvents.map((evt) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={evt.id}
              className="bg-white border-2 border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#18572c] transition-all flex flex-col justify-between group"
            >
              {/* Event Image Banner */}
              <div className="relative h-64 overflow-hidden bg-zinc-900">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-[#cf030f] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                  {evt.category}
                </div>

                {/* Location & Date Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{evt.date}</span>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#18572c] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Award className="w-3.5 h-3.5 text-[#cf030f]" />
                    <span>{evt.impact}</span>
                  </div>

                  <h3 className="font-serif font-black text-2xl text-zinc-900 leading-snug group-hover:text-[#18572c] transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#cf030f] hover:text-[#18572c] transition-colors cursor-pointer group/btn"
                  >
                    <span>Read Full Event Story</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Misis Siomai Outreach
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Media Link & Partnership Callout */}
        <div className="bg-gradient-to-r from-[#18572c] to-[#0d3419] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border-2 border-[#D4AF37]/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cf030f]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            <div className="lg:col-span-2 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-[#cf030f]" />
                <span>Partner with Us</span>
              </div>
              <h3 className="font-serif font-black text-3xl sm:text-4xl text-white">
                Want to Nominate a Community or Partner for Charity?
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
                We are always eager to extend our helping hands to local communities, feeding programs, and school drives across Cebu and neighboring provinces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={contact.facebook_url || 'https://www.facebook.com/profile.php?id=100028835748373'}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-white text-[#18572c] hover:bg-[#D4AF37] hover:text-[#18572c] font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                <span>Follow on Facebook</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {onOpenFranchiseModal && (
                <button
                  onClick={() => onOpenFranchiseModal('general')}
                  className="px-6 py-3.5 rounded-full bg-[#cf030f] hover:bg-[#a6020c] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Social Outreach Inquiry</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border-2 border-[#D4AF37]/50 my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#cf030f] transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative h-72 bg-zinc-900">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="bg-[#cf030f] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {selectedEvent.category}
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl leading-tight">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-zinc-600 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-1.5 text-[#18572c] font-bold">
                    <MapPin className="w-4 h-4 text-[#cf030f]" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#cf030f]">
                    <Award className="w-4 h-4" />
                    <span>{selectedEvent.impact}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-black text-lg text-zinc-900">Event Story & Overview</h4>
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-sm text-[#18572c] uppercase tracking-wider">Key Highlights</h4>
                  <ul className="space-y-2">
                    {selectedEvent.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700">
                        <Sparkles className="w-4 h-4 text-[#cf030f] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote Box */}
                {selectedEvent.quote && (
                  <div className="p-4 rounded-2xl bg-[#FAF3E3] border border-[#D4AF37]/40 text-xs sm:text-sm italic text-[#18572c] font-medium leading-relaxed">
                    {selectedEvent.quote}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2.5 rounded-full bg-[#18572c] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#113d1e] transition-colors cursor-pointer"
                  >
                    Close Story
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
