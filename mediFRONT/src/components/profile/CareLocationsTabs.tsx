import React, { useState } from 'react';
import type { Doctor } from '../../types/doctor';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';

export const CareLocationsTabs: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!doctor.careLocations || doctor.careLocations.length === 0) return null;

  const loc = doctor.careLocations[activeTab];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-[#1C365C] mb-8 tracking-tight">Lugares de Atención</h2>
      
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
        {doctor.careLocations.map((l, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
              activeTab === i 
                ? 'bg-[#1C365C] text-white border-[#1C365C] shadow-lg shadow-[#1C365C]/20 scale-105' 
                : 'bg-[#FDF9F3] text-[#1C365C]/50 border-transparent hover:bg-[#FDF9F3]/70 hover:text-[#1C365C]'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8 bg-[#FDF9F3]/50 p-6 sm:p-8 rounded-[2rem] border border-[#1C365C]/5">
        <div className="space-y-6 text-sm text-[#1C365C]/70">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
              <MapPin className="w-5 h-5 text-[#5A9BD4] shrink-0" />
            </div>
            <div className="flex flex-col mt-0.5">
               <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1">Dirección</span>
               <p className="font-semibold text-[#1C365C]">{loc.address}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
              <Clock className="w-5 h-5 text-[#5A9BD4] shrink-0" />
            </div>
            <div className="flex flex-col mt-0.5">
               <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1">Horarios</span>
               <p className="font-semibold text-[#1C365C]">{loc.availability}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
              <Phone className="w-5 h-5 text-[#5A9BD4] shrink-0" />
            </div>
            <div className="flex flex-col mt-0.5">
               <span className="font-bold text-[#1C365C]/40 text-[10px] uppercase tracking-widest mb-1">Teléfono</span>
               <p className="font-semibold text-[#1C365C]">{loc.phone}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 gap-2 border-[#1C365C]/10 text-[#1C365C] font-bold h-12 rounded-xl hover:bg-white transition-all shadow-sm">
            <Navigation className="w-4 h-4 text-[#5A9BD4]" /> Ver indicaciones
          </Button>
        </div>
        <div className="bg-[#1C365C]/5 rounded-[1.5rem] flex flex-col items-center justify-center min-h-[220px] text-[#1C365C]/30 relative overflow-hidden group border border-[#1C365C]/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C365C]/5 to-transparent pointer-events-none" />
          <MapPin className="w-10 h-10 opacity-30 mb-3 group-hover:scale-110 transition-transform duration-500 text-[#1C365C]" />
          <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Vista previa del mapa</span>
        </div>
      </div>
    </div>
  );
};
