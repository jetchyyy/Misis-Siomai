import React, { useState } from 'react';
import { MapPin, Phone, Clock, Store, Heart, Sparkles } from 'lucide-react';

const BRANCHES = [
  {
    id: 1,
    name: 'Misis Siomai - Quezon City Hub',
    address: 'Near MRT-3 Cubao Station, EDSA Cor. Aurora Blvd, Quezon City',
    region: 'Metro Manila',
    hours: '7:00 AM - 10:00 PM',
    phone: '+63 917 111 2222',
    status: 'Open Now',
  },
  {
    id: 2,
    name: 'Misis Siomai - Manila University Belt',
    address: 'Recto Ave near FEU & UE Main Campus, Sampaloc, Manila',
    region: 'Metro Manila',
    hours: '6:30 AM - 9:30 PM',
    phone: '+63 917 222 3333',
    status: 'Open Now',
  },
  {
    id: 3,
    name: 'Misis Siomai - SM North Annex Kiosk',
    address: 'Ground Level Food Court, SM City North EDSA, Quezon City',
    region: 'Metro Manila',
    hours: '10:00 AM - 9:00 PM',
    phone: '+63 917 333 4444',
    status: 'Open Now',
  },
  {
    id: 4,
    name: 'Misis Siomai - Angeles City Pampanga',
    address: 'Nepo Quad Food District, Angeles City, Pampanga',
    region: 'Central Luzon',
    hours: '8:00 AM - 9:00 PM',
    phone: '+63 917 444 5555',
    status: 'Open Now',
  },
  {
    id: 5,
    name: 'Misis Siomai - Cebu Colon Street Kiosk',
    address: 'Colon St. cor. Junquera St., Cebu City',
    region: 'Visayas',
    hours: '7:00 AM - 9:30 PM',
    phone: '+63 917 555 6666',
    status: 'Open Now',
  },
  {
    id: 6,
    name: 'Misis Siomai - Davao Bajada Hub',
    address: 'JP Laurel Ave., Bajada, Davao City',
    region: 'Mindanao',
    hours: '8:00 AM - 9:00 PM',
    phone: '+63 917 666 7777',
    status: 'Opening Soon',
  },
];

export default function BranchLocator() {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Metro Manila', 'Central Luzon', 'Visayas', 'Mindanao'];

  const filteredBranches = selectedRegion === 'All'
    ? BRANCHES
    : BRANCHES.filter(b => b.region === selectedRegion);

  return (
    <section id="branches" className="py-20 md:py-28 bg-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Banner */}
        <div className="mb-20 glass-card rounded-3xl p-8 lg:p-12 bg-gradient-to-r from-rose-900 via-rose-800 to-zinc-900 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Our Inspiring Journey
              </div>
              <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                From 1 Humble Cart to <span className="text-amber-400">50+ Branches</span> Nationwide
              </h3>
              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                Founded with a simple mission: to serve hardworking Filipinos authentic, 100% meat-filled dimsum that is both delicious and affordable. Today, Misis Siomai empowers micro-entrepreneurs and families across the country to build sustainable, profitable food cart businesses.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="font-heading font-black text-4xl text-white">100%</div>
                <div className="text-xs font-semibold text-rose-200 uppercase tracking-wider">Filipino Owned & Operated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Store className="w-4 h-4 text-amber-600" />
            Store Locations
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
            Find a <span className="text-rose-600">Misis Siomai</span> Near You
          </h2>
          <p className="text-base text-zinc-600">
            Craving hot steamed siomai? Visit any of our active food carts and kiosks nationwide.
          </p>
        </div>

        {/* Region Filter */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === region
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-rose-50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Branch Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white border border-rose-900/10 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{branch.region}</span>
                  <h4 className="font-heading font-extrabold text-lg text-zinc-900 mt-0.5">{branch.name}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  branch.status === 'Open Now' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {branch.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
