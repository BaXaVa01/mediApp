import React from 'react';
import type { Doctor } from '../../types/doctor';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorAvailabilityPanel: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.05)] border border-[#1C365C]/5 p-8 sticky top-28">
      <h3 className="text-xl font-bold text-[#1C365C] mb-8 tracking-tight flex items-center gap-3">
        <div className="p-2 bg-[#5A9BD4]/10 rounded-xl">
          <Calendar className="h-5 w-5 text-[#5A9BD4]" />
        </div>
        Horarios de Atención
      </h3>

      <div className="space-y-4 mb-10">
        {doctor.schedule.map((s, i) => (
          <div key={i} className="flex justify-between items-start text-sm border-b border-[#1C365C]/5 pb-4 last:border-0 last:pb-0">
            <span className="font-bold text-[#1C365C]/70">{s.day}</span>
            <div className="flex flex-col items-end gap-1.5">
               {s.hours.split(',').map((h, idx) => (
                 <span key={idx} className="text-right text-[#1C365C] font-semibold bg-[#FDF9F3] px-2.5 py-1 rounded-md text-xs border border-[#1C365C]/5">
                   {h.trim()}
                 </span>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FDF9F3]/80 p-6 rounded-[2rem] border border-[#1C365C]/5 text-center">
        <div className="flex items-center justify-center gap-2 text-[#5A9BD4] mb-2">
          <Clock className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-widest">Próxima Cita</p>
        </div>
        <p className="font-bold text-[#1C365C] text-xl mb-6">Mañana, 09:00 AM</p>
        <Button className="w-full h-14 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] active:scale-95 transition-all text-base font-bold rounded-2xl shadow-lg shadow-[#5A9BD4]/20 flex items-center justify-center gap-2 group">
          Agendar Cita 
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <p className="text-xs text-[#1C365C]/40 text-center mt-6 font-medium">
        * Sujeto a disponibilidad en tiempo real.
      </p>
    </div>
  );
};
