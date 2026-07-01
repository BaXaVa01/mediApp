import React from 'react';
import { Star, MapPin, ShieldCheck, MessageCircle, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Doctor } from '../../types/doctor';
import { Button } from '../ui/Button';

export const ProfileHero: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.05)] border border-[#1C365C]/5 p-8 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden group">
      {/* Decorative Background Shape */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5A9BD4]/5 rounded-full blur-3xl group-hover:bg-[#5A9BD4]/10 transition-colors duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E6CBB8]/5 rounded-full blur-3xl group-hover:bg-[#E6CBB8]/10 transition-colors duration-700" />
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative shrink-0"
      >
        <img 
          src={doctor.photo} 
          alt={doctor.name}
          className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] object-cover border-8 border-white shadow-xl relative z-10"
        />
        <div className="absolute -inset-2 bg-gradient-to-br from-[#5A9BD4]/20 to-[#E6CBB8]/20 rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
      
      <div className="flex-1 w-full z-10 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C365C] tracking-tight leading-none">{doctor.name}</h1>
          <div className="flex items-center gap-1.5 bg-[#A3C9A8]/10 px-3 py-1 rounded-full border border-[#A3C9A8]/20">
            <ShieldCheck className="h-4 w-4 text-[#A3C9A8]" />
            <span className="text-[10px] font-bold text-[#1C365C] uppercase tracking-wider">Verificado</span>
          </div>
        </div>
        
        <p className="text-xl text-[#5A9BD4] font-semibold mb-2">{doctor.specialty}</p>
        <p className="text-[11px] text-[#1C365C]/30 mb-6 font-mono tracking-widest uppercase">Cédula Profesional · {doctor.licenseNumber}</p>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-[#1C365C]/60 text-sm mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#FDF9F3] px-3 py-1.5 rounded-full border border-[#1C365C]/5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-[#1C365C]">{doctor.rating}</span>
            </div>
            <span className="text-xs font-medium">({doctor.reviewCount} reseñas)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#5A9BD4]/10 rounded-lg">
              <MapPin className="h-4 w-4 text-[#5A9BD4]" />
            </div>
            <span className="font-medium">{doctor.location?.address || 'Dirección no disponible'}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Button 
            onClick={() => {
              const element = document.getElementById('booking-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="h-14 px-10 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] active:scale-95 transition-all text-lg font-bold rounded-2xl shadow-lg shadow-[#5A9BD4]/20 flex items-center gap-3"
          >
            <CalendarDays className="w-5 h-5" />
            Agendar Cita
          </Button>
          <Button 
            variant="outline" 
            className="h-14 px-10 border-[#1C365C]/10 text-[#1C365C] hover:bg-[#FDF9F3] active:scale-95 transition-all text-lg font-bold rounded-2xl flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5 text-[#5A9BD4]" />
            Enviar Mensaje
          </Button>
        </div>
      </div>
    </div>
  );
};
