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
  ChevronLeft,
  ChevronRight,
  Award,
  Camera,
  Maximize
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
  // Active photo index in modal gallery
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  // Active category filter
  const [activeCategory, setActiveCategory] = useState('All');
  // Fullscreen image viewer state
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openEventModal = (evt) => {
    setSelectedEvent(evt);
    setActivePhotoIdx(0);
  };

  // Decorative Chinese Fretwork Corner Component
  const FretworkCorner = ({ className }) => (
    <svg className={className} width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 49 V 15 H 15 V 1 H 49" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <path d="M9 41 V 23 H 23 V 9 H 41" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  );

  // Use CMS charity events or fallback defaults
  const events = (cms.socials && Array.isArray(cms.socials.events) && cms.socials.events.length > 0)
    ? cms.socials.events
    : defaultEvents;

  // Categories list
  const categories = ['All', ...new Set(events.map(e => e.category).filter(Boolean))];

  // Filtered events
  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F2] relative overflow-hidden text-zinc-800">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18572c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#cf030f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-4 text-[#cf030f] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
            Misis Siomai Cares
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
          </div>

          <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight">
            Our Community & <span className="text-[#18572c]">Social Initiatives</span>
          </h2>

          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
            Beyond serving Cebu&apos;s favorite dimsum, Misis Siomai is dedicated to nourishing local communities through feeding programs, school kit drives, and disaster relief.
          </p>

          {/* Category Filter Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#18572c] text-white shadow-md'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredEvents.map((evt) => {
            const cardImages = Array.isArray(evt.images) && evt.images.length > 0 ? evt.images : [evt.image];
            const coverImage = cardImages[0] || evt.image;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={evt.id || evt.title}
                className="bg-white border-2 border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#18572c] transition-all flex flex-col justify-between group"
              >
                {/* Event Image Banner */}
                <div className="relative h-64 overflow-hidden bg-zinc-900 cursor-pointer" onClick={() => openEventModal(evt)}>
                  <img
                    src={coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-[#cf030f] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    {evt.category}
                  </div>

                  {/* Multi-photo indicator badge */}
                  {cardImages.length > 1 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{cardImages.length} Photos</span>
                    </div>
                  )}

                  {/* Location & Date Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm text-[#18572c] shadow-md border border-[#18572c]/10">
                      <MapPin className="w-3.5 h-3.5 text-[#cf030f]" />
                      <span className="truncate max-w-[120px]">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm text-[#18572c] shadow-md border border-[#18572c]/10">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="truncate max-w-[120px]">{evt.date}</span>
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
                      onClick={() => openEventModal(evt)}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#cf030f] hover:text-[#18572c] transition-colors cursor-pointer group/btn"
                    >
                      <span>Read Story & Photos ({cardImages.length})</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Misis Siomai Outreach
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Social Media Link & Partnership Callout */}
        <div 
          className="bg-[#18572c] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border-2 border-[#D4AF37]/50"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40c11.046 0 20-8.954 20-20S11.046 0 0 0h40c0 11.046-8.954 20-20 20s-20 8.954-20 20h40zM20 20c-11.046 0-20-8.954-20-20h40c0 11.046-8.954 20-20 20z\'/%3E%3C/g%3E%3C/svg%3E")' }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cf030f]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
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
        {selectedEvent && (() => {
          const modalImages = Array.isArray(selectedEvent.images) && selectedEvent.images.length > 0
            ? selectedEvent.images
            : [selectedEvent.image];
          const currentPhoto = modalImages[activePhotoIdx] || selectedEvent.image;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden"
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl relative"
              >
                {/* Close Button (Absolute to the whole modal) */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-[60] w-8 h-8 rounded-full bg-black/10 lg:bg-zinc-100 text-white lg:text-zinc-500 hover:bg-black/30 lg:hover:bg-zinc-200 lg:hover:text-zinc-900 transition-colors flex items-center justify-center cursor-pointer"
                  title="Close Story"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* LEFT PANE: Carousel & Thumbnails */}
                <div className="w-full lg:w-1/2 flex flex-col shrink-0 bg-[#0a0a0a]">
                  {/* Modal Image Slider Banner */}
                  <div className="relative h-56 sm:h-72 lg:h-auto lg:flex-1 shrink-0 flex items-center justify-center overflow-hidden group">
                    <img
                      src={currentPhoto}
                      alt={`${selectedEvent.title} - photo ${activePhotoIdx + 1}`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent lg:hidden pointer-events-none" />

                    {/* Maximize Fullscreen Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenImage(currentPhoto);
                      }}
                      className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-50"
                      title="View Full Screen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>

                    {/* Multi-photo Navigation arrows */}
                    {modalImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1));
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white/90 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhotoIdx((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0));
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white/90 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white space-y-1.5 pointer-events-none lg:hidden">
                      <span className="bg-[#cf030f] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {selectedEvent.category}
                      </span>
                      <h3 className="font-serif font-black text-xl sm:text-2xl leading-tight text-white drop-shadow">
                        {selectedEvent.title}
                      </h3>
                    </div>
                  </div>

                  {/* Thumbnail Strip Gallery (if multiple photos exist) */}
                  {modalImages.length > 1 && (
                    <div className="shrink-0 bg-[#0a0a0a] px-6 py-4 flex items-center gap-3 overflow-x-auto">
                      {modalImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhotoIdx(i)}
                          className={`relative w-12 h-12 rounded overflow-hidden shrink-0 transition-all cursor-pointer ${
                            activePhotoIdx === i
                              ? 'opacity-100 ring-1 ring-white/70 ring-offset-2 ring-offset-[#0a0a0a]'
                              : 'opacity-30 hover:opacity-70'
                          }`}
                        >
                          <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT PANE: Modal Body Content */}
                <div className="w-full lg:w-1/2 flex-1 overflow-y-auto bg-white relative scrollbar-hide flex flex-col">
                  
                  <div className="p-6 sm:p-10 flex-1 flex flex-col space-y-8">
                    {/* Header info (Category & Title) visible on Desktop at the top of content */}
                    <div className="hidden lg:block space-y-4">
                      <span className="text-[#cf030f] text-[10px] font-bold uppercase tracking-widest border border-[#cf030f]/20 px-3 py-1 rounded-full">
                        {selectedEvent.category}
                      </span>
                      <h3 className="font-serif font-medium text-3xl sm:text-4xl leading-tight text-zinc-900 tracking-tight">
                        {selectedEvent.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-medium">
                      <div className="uppercase tracking-widest text-zinc-800">
                        {selectedEvent.location}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-300" />
                      <div className="uppercase tracking-widest">
                        {selectedEvent.date}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-300" />
                      <div className="uppercase tracking-widest text-[#18572c]">
                        {selectedEvent.impact}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>

                    {/* Highlights List */}
                    {Array.isArray(selectedEvent.highlights) && selectedEvent.highlights.length > 0 && (
                      <div className="space-y-3">
                        <ul className="space-y-3">
                          {selectedEvent.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0" />
                              <span className="leading-relaxed">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quote Box */}
                    {selectedEvent.quote && (
                      <div className="border-l-2 border-[#D4AF37] pl-5 py-1 my-4 mt-auto">
                        <p className="text-zinc-500 text-sm sm:text-base italic leading-relaxed">
                          &quot;{selectedEvent.quote.replace(/^"|"$/g, '')}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
