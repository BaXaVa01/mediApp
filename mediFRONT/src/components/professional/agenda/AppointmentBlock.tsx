import React from 'react';
import { motion } from 'framer-motion';
import type { Appointment } from '../../../utils/agendaMockData';
import { useAgendaStore } from '../../../store/agendaStore';

interface AppointmentBlockProps {
  apt: Appointment;
  dayIndex: number; // 0 for daily, 0-6 for weekly
}

export const AppointmentBlock: React.FC<AppointmentBlockProps> = ({ apt, dayIndex }) => {
  const { selectedAppointment, setSelectedAppointment, viewMode, reschedule } = useAgendaStore();
  const [isDragging, setIsDragging] = React.useState(false);

  // Calculate position and height based on 60px per hour starting at 08:00
  const startHour = apt.startTime.getHours() + apt.startTime.getMinutes() / 60;
  const endHour = apt.endTime.getHours() + apt.endTime.getMinutes() / 60;

  const baseHour = 8; // Start of grid is 08:00
  const topPx = Math.max(0, (startHour - baseHour) * 60);
  const heightPx = Math.max(20, (endHour - startHour) * 60);

  // Layout calculation
  const totalCols = viewMode === 'weekly' ? 7 : 1;
  const colWidthPct = 100 / totalCols;
  const leftPct = dayIndex * colWidthPct;

  const isSelected = selectedAppointment?.id === apt.id;

  // Visual mapping
  const styleMap = {
    confirmed: { bg: 'bg-[#5A9BD4]/10', border: 'border-[#5A9BD4]', text: 'text-[#5A9BD4]' },
    pending: { bg: 'bg-[#E6CBB8]/20', border: 'border-[#E6CBB8]', text: 'text-[#E6CBB8]' },
    cancelled: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-500' },
    completed: { bg: 'bg-[#A3C9A8]/20', border: 'border-[#A3C9A8]', text: 'text-[#A3C9A8]' }
  };

  const style = styleMap[apt.status] || styleMap.pending;

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);

    // Vertical offset -> Time change (1px = 1 min)
    const minutesDelta = Math.round(info.offset.y);

    // Horizontal offset -> Day change
    // We need the approximate width of a column. 
    // Since we don't have the pixel width easily, we'll estimate or use simple logic.
    // For now, let's focus on vertical time change as it's the most common.

    const newStart = new Date(apt.startTime);
    newStart.setMinutes(newStart.getMinutes() + minutesDelta);

    // Round to nearest 15 mins for taste
    const roundedMins = Math.round(newStart.getMinutes() / 15) * 15;
    newStart.setMinutes(roundedMins);

    const durationMs = apt.endTime.getTime() - apt.startTime.getTime();
    const newEnd = new Date(newStart.getTime() + durationMs);

    // Boundary check (08:00 - 19:00)
    if (newStart.getHours() >= 8 && newEnd.getHours() <= 19) {
      reschedule(apt.id, newStart, newEnd);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50 : (isSelected ? 10 : 0)
      }}
      whileHover={{ scale: isDragging ? 1.05 : 1.02, zIndex: 40 }}
      onClick={() => !isDragging && setSelectedAppointment(apt)}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: `calc(${leftPct}% + 4px)`,
        width: `calc(${colWidthPct}% - 8px)`,
        touchAction: 'none'
      }}
      className={`absolute border-l-4 rounded-xl p-3 overflow-hidden shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${style.bg} ${style.border} ${isSelected ? 'ring-2 ring-offset-2 ring-[#5A9BD4]/30 shadow-lg' : ''} ${isDragging ? 'shadow-2xl' : ''}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-black leading-none ${style.text}`}>
          {apt.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isDragging && <div className="w-1.5 h-1.5 rounded-full bg-[#5A9BD4] animate-pulse" />}
      </div>
      <span className="text-[12px] font-bold text-[#1C365C] leading-tight block truncate">
        {apt.patientName}
      </span>
      {heightPx >= 50 && (
        <span className="text-[10px] text-[#1C365C]/50 font-medium leading-none block truncate mt-1">
          {apt.service}
        </span>
      )}
    </motion.div>
  );
};