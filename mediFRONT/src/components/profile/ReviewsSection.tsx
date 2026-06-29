import React from 'react';
import type { Doctor } from '../../types/doctor';
import { Star, MessageSquare } from 'lucide-react';

export const ReviewsSection: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  if (!doctor.reviews || doctor.reviews.length === 0) return null;
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight flex items-center gap-3">
          Opiniones de pacientes 
          <span className="bg-[#1C365C]/5 px-3 py-1 rounded-lg text-sm text-[#1C365C] font-black border border-[#1C365C]/10">{doctor.reviewCount}</span>
        </h2>
        <div className="flex items-center gap-2 bg-[#FDF9F3] px-4 py-2 rounded-xl border border-[#1C365C]/5">
           <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
           <span className="font-black text-xl text-[#1C365C]">{doctor.rating}</span>
        </div>
      </div>

      <div className="space-y-6">
        {doctor.reviews.map((rev, i) => (
          <div key={i} className="p-8 border border-[#1C365C]/5 rounded-[2rem] bg-[#FDF9F3]/50 hover:bg-white hover:shadow-[0_10px_30px_rgba(28,54,92,0.03)] transition-all group">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5A9BD4]/10 flex items-center justify-center text-[#5A9BD4] font-bold text-lg border border-[#5A9BD4]/20 group-hover:scale-105 transition-transform">
                  {rev.patientName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1C365C] text-lg leading-tight">{rev.patientName}</p>
                  <p className="text-[10px] text-[#1C365C]/40 uppercase tracking-widest font-bold mt-0.5">{rev.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-[#1C365C]/5">
                {[...Array(5)].map((_, starIdx) => (
                  <Star 
                    key={starIdx} 
                    className={`w-3.5 h-3.5 ${starIdx < Math.floor(rev.rating) ? 'text-amber-500 fill-amber-500' : 'text-[#1C365C]/10'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <MessageSquare className="w-5 h-5 text-[#1C365C]/20 shrink-0 mt-1" />
              <p className="text-base text-[#1C365C]/70 leading-relaxed font-medium">"{rev.comment}"</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-4 text-[#5A9BD4] font-bold text-sm bg-[#5A9BD4]/5 rounded-xl hover:bg-[#5A9BD4]/10 transition-colors">
        Ver todas las reseñas
      </button>
    </div>
  );
};
