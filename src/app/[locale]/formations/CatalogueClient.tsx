'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, BarChart, BrainCircuit, Play } from 'lucide-react';

export default function CatalogueClient({ formations }: { formations: any[] }) {
  const [filterNiveau, setFilterNiveau] = useState('All');
  const [filterAcces, setFilterAcces] = useState('All');

  // themes and translations
  const cardThemes = [
    { bg: 'bg-[#7E57C2]', icon: BookOpen, badgeRight: 'Popular' },
    { bg: 'bg-[#0088FF]', icon: BarChart, badgeRight: 'New' },
    { bg: 'bg-[#00C48C]', icon: BrainCircuit, badgeRight: null }
  ];

  // Helper to translate DB  to English
  const translateLevel = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'débutant': return 'Beginner';
      case 'intermédiaire': return 'Intermediate';
      case 'avancé': return 'Advanced';
      default: return level || 'Beginner';
    }
  };

  // helper to match filter to DB value
  const getDbLevel = (filter: string) => {
    switch (filter) {
      case 'Beginner': return 'beginner';
      case 'Intermediate': return 'intermediate';
      case 'Advanced': return 'advanced';
      default: return 'all';
    }
  };

  const filteredFormations = formations.filter(f => {
    const dbLevelFilter = getDbLevel(filterNiveau);
    const matchNiveau = dbLevelFilter === 'all' || f.niveau?.toLowerCase() === dbLevelFilter;
    const isGratuit = f.gratuit === true || f.gratuit === 'true'; // handle boolean or string
    const matchAcces = filterAcces === 'All' 
      ? true 
      : filterAcces === 'Free' ? isGratuit : !isGratuit;
    return matchNiveau && matchAcces;
  });

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <h3 className="text-[#0066FF] text-xs font-bold uppercase tracking-[0.2em] mb-4">Catalog</h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Start with the essentials</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-[15px] leading-relaxed">
          All our courses are AI-enhanced, continuously updated, and available from day one — at no cost.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16">
        <div className="flex bg-white rounded-full p-1 border border-slate-200 shadow-sm">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(niv => (
            <button 
              key={niv}
              onClick={() => setFilterNiveau(niv)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${filterNiveau === niv ? 'bg-[#0066FF] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {niv}
            </button>
          ))}
        </div>
        <div className="flex bg-white rounded-full p-1 border border-slate-200 shadow-sm">
          {['All', 'Free', 'Paid'].map(acc => (
            <button 
              key={acc}
              onClick={() => setFilterAcces(acc)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${filterAcces === acc ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {acc}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
        {filteredFormations.length > 0 ? filteredFormations.map((formation, index) => {
          const theme = cardThemes[index % cardThemes.length];
          const Icon = theme.icon;
          
          return (
            <div key={formation.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition duration-300">
              {/* Top Half */}
              <div 
                className={`${formation.imageUrl ? 'bg-cover bg-center' : theme.bg} h-48 relative p-6 flex flex-col justify-between`}
                style={formation.imageUrl ? { backgroundImage: `url(${formation.imageUrl})` } : {}}
              >
                {formation.imageUrl && <div className="absolute inset-0 bg-slate-900/30"></div>}
                
                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                    {formation.gratuit !== false ? 'Free' : 'Paid'}
                  </span>
                  {theme.badgeRight && (
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-white/20">
                      {theme.badgeRight}
                    </span>
                  )}
                </div>
                <div className="relative z-10 absolute right-6 bottom-6 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              
              {/* Bottom Half */}
              <div className="p-6 flex-grow flex flex-col">
                {/* Title turns blue on hover */}
                <h3 className="text-[1.1rem] font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors mb-4 leading-tight">
                  {formation.titre}
                </h3>
                
                <div className="flex items-center gap-4 text-[13px] font-bold text-slate-400 mb-8">
                  <span className="flex items-center gap-1.5"><BarChart size={14} /> {translateLevel(formation.niveau)}</span>
                  <span className="flex items-center gap-1.5"><Play size={14} /> {formation.duree || '6h 30'}</span>
                </div>
                
                {/* Button turns blue background with white text on hover */}
                <Link href={`/formations/${formation.id}`} className="mt-auto w-full text-center py-3 border border-blue-200 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white group-hover:border-[#0066FF] font-bold text-[14px] rounded-2xl transition-colors">
                  {formation.gratuit !== false ? "Enroll for free" : "View Course"}
                </Link>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full text-center py-12 text-slate-500 font-medium">
            No courses match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
