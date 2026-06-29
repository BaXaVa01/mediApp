import React from 'react';
import type { Doctor } from '../../types/doctor';

export const GalleryGrid: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  if (!doctor.gallery || doctor.gallery.length === 0) return null;
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-[#1C365C] mb-8 tracking-tight">Fotos e Instalaciones</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {doctor.gallery.map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[1.5rem] aspect-[4/3] bg-[#FDF9F3] border border-[#1C365C]/5">
            <img 
              src={img} 
              alt={`Instalación ${i+1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-[#1C365C]/0 group-hover:bg-[#1C365C]/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};
