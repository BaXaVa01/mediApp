import React from 'react';
import type { AvailabilitySlot } from '../../types/doctor';
import { Calendar } from 'lucide-react';

interface AvailabilityPreviewProps {
  slots: AvailabilitySlot[];
}

export const AvailabilityPreview: React.FC<AvailabilityPreviewProps> = ({ slots }) => {
  if (!slots || slots.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-1.5 mb-2 text-sm text-[#4A628A] font-medium">
        <Calendar className="w-4 h-4 text-[#5A9BD4]" />
        <span>Disponibilidad cercana</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot, index) => (
          <div 
            key={index}
            className="flex flex-col items-center justify-center px-3 py-1.5 bg-[#E6CBB8]/10 border border-[#E6CBB8]/30 rounded-lg cursor-pointer hover:border-[#5A9BD4] hover:bg-[#5A9BD4]/5 transition-colors"
          >
            <span className="text-xs font-bold text-[#1C365C]">{slot.date}</span>
            <span className="text-[10px] text-[#4A628A]">{slot.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
