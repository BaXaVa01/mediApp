import React from 'react';
import type { Doctor } from '../../types/doctor';
import { Stethoscope, Clock, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const ServicesPricingCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-[#1C365C] mb-8 tracking-tight flex items-center gap-3">
        <div className="p-2 bg-[#5A9BD4]/10 rounded-xl">
          <Stethoscope className="w-5 h-5 text-[#5A9BD4]" />
        </div>
        Servicios y Precios
      </h2>
      
      <div className="space-y-4">
        {doctor.servicesDetails.map((service, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#FDF9F3]/50 rounded-2xl gap-4 border border-[#1C365C]/5 hover:border-[#5A9BD4]/20 hover:bg-[#FDF9F3] transition-all group">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-1 bg-white rounded-full shadow-sm border border-[#1C365C]/5 group-hover:scale-110 transition-transform">
                <Check className="w-3 h-3 text-[#5A9BD4]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C365C] text-lg mb-0.5 group-hover:text-[#5A9BD4] transition-colors">{service.name}</h3>
                {service.duration && (
                  <div className="flex items-center gap-1.5 text-sm text-[#1C365C]/50 mt-1 font-medium">
                    <Clock className="w-4 h-4" /> {service.duration}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end pl-11 sm:pl-0">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[11px] uppercase tracking-wider text-[#1C365C]/40 font-bold mb-0.5">Precio</span>
                <span className="text-2xl font-bold text-[#1C365C]">${service.price}</span>
              </div>
              <Button size="sm" variant="outline" className="border-[#1C365C]/10 text-[#1C365C] hover:bg-[#FDF9F3] shrink-0 font-bold px-6 h-11 rounded-xl">
                Agendar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
