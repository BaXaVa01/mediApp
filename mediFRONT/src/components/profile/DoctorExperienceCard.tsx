import React, { useState } from 'react';
import type { Doctor } from '../../types/doctor';
import { Briefcase, UserPlus, HeartPulse, Video, Info } from 'lucide-react';
import { MoreInfoModal } from './MoreInfoModal';
import { Button } from '../ui/Button';

export const DoctorExperienceCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(28,54,92,0.03)] border border-[#1C365C]/5 p-8 sm:p-10">
      <h2 className="text-2xl font-bold text-[#1C365C] mb-6 tracking-tight">Experiencia y Acerca de</h2>
      <p className="text-[#1C365C]/60 text-lg mb-10 leading-relaxed max-w-3xl">{doctor.bio}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {[
          { icon: Briefcase, label: "Experiencia", value: doctor.experience },
          { icon: HeartPulse, label: "Enfermedades tratadas", value: doctor.diseasesTreated.slice(0, 3).join(', ') + (doctor.diseasesTreated.length > 3 ? '...' : '') },
          { icon: UserPlus, label: "Tipos de pacientes", value: doctor.patientTypes.join(', ') },
          { icon: Video, label: "Tipos de consulta", value: doctor.consultationTypes.join(', ') },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 group">
            <div className="p-3 bg-[#5A9BD4]/5 rounded-2xl group-hover:bg-[#5A9BD4]/10 transition-colors">
              <item.icon className="w-5 h-5 text-[#5A9BD4] shrink-0" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C365C] mb-0.5">{item.label}</p>
              <p className="text-sm text-[#1C365C]/50 font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        onClick={() => setIsModalOpen(true)} 
        className="w-full flex justify-center gap-2 border-dashed border-[#1C365C]/10 text-[#1C365C] hover:bg-[#FDF9F3] hover:border-[#5A9BD4]/30 h-14 rounded-2xl font-bold transition-all"
      >
        <Info className="w-5 h-5" /> Mostrar más información detallada
      </Button>

      <MoreInfoModal doctor={doctor} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
