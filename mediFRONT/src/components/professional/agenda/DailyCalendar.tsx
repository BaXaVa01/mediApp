import React from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export const DailyCalendar: React.FC = () => {
  const { viewMode, setViewMode } = useAgendaStore();

  const days = [
    { day: 'MON', date: '6' },
    { day: 'TUE', date: '7' },
    { day: 'WED', date: '8', active: true },
    { day: 'THU', date: '9' },
    { day: 'FRI', date: '10' },
    { day: 'SAT', date: '11', weekend: true },
    { day: 'SUN', date: '12', weekend: true },
  ];

  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#1C365C]/5">
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Week of May 6-12</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#FDF9F3] p-1 rounded-xl border border-[#1C365C]/5">
            <button 
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'weekly' ? 'bg-white shadow-sm text-[#5A9BD4]' : 'text-[#1C365C]/50 hover:text-[#1C365C]'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('daily')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'daily' ? 'bg-white shadow-sm text-[#5A9BD4]' : 'text-[#1C365C]/50 hover:text-[#1C365C]'}`}
            >
              Day
            </button>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FDF9F3] hover:bg-[#FDF9F3]/70 text-[#1C365C] transition-colors border border-[#1C365C]/5">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FDF9F3] hover:bg-[#FDF9F3]/70 text-[#1C365C] transition-colors border border-[#1C365C]/5">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Header (Days) */}
      <div className="flex border-b border-[#1C365C]/5">
        <div className="w-20 shrink-0 border-r border-[#1C365C]/5"></div>
        {days.map((d, i) => (
          <div key={i} className={`flex-1 flex flex-col items-center justify-center py-4 border-r border-[#1C365C]/5 last:border-0 ${d.weekend ? 'bg-[#FDF9F3]/30' : ''}`}>
            <span className={`text-[10px] font-bold tracking-widest mb-1 ${d.active ? 'text-[#5A9BD4]' : 'text-[#1C365C]/40'}`}>{d.day}</span>
            <span className={`text-xl font-bold ${d.active ? 'text-[#5A9BD4]' : d.weekend ? 'text-[#1C365C]/20' : 'text-[#1C365C]'}`}>{d.date}</span>
            {d.active && <div className="w-1 h-1 rounded-full bg-[#5A9BD4] mt-1" />}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex h-[800px]">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-[#1C365C]/5 flex flex-col">
            {times.map((t, i) => (
              <div key={i} className="flex-1 border-b border-[#1C365C]/5 relative">
                <span className="absolute -top-2.5 right-2 text-[9px] font-semibold text-[#1C365C]/30">{t}</span>
              </div>
            ))}
          </div>
          
          {/* Days Columns */}
          <div className="flex-1 flex relative">
            {days.map((d, i) => (
              <div key={i} className={`flex-1 border-r border-[#1C365C]/5 last:border-0 flex flex-col ${d.weekend ? 'bg-[#FDF9F3]/30' : ''}`}>
                {times.map((_, j) => (
                  <div key={j} className="flex-1 border-b border-[#1C365C]/5"></div>
                ))}
              </div>
            ))}
            
            {/* Events (Absolute positioned for mockup) */}
            
            {/* Lunch Break block */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="absolute left-[calc((100%/7)*0+4px)] right-[calc(100%-(100%/7)*1+4px)] top-0 h-[30px] bg-[#1C365C]/5 border-l-4 border-[#1C365C]/20 rounded-md p-1.5 overflow-hidden flex flex-col justify-center"
            >
              <span className="text-[9px] font-bold text-[#1C365C]/40 leading-none mb-0.5">11:00 - 12:00</span>
              <span className="text-[10px] font-bold text-[#1C365C]/60 leading-none truncate">Lunch Break</span>
            </motion.div>

            {/* Arthur Morgan Appointment */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute left-[calc((100%/7)*2+4px)] right-[calc(100%-(100%/7)*3+4px)] top-[20%] h-[15%] bg-[#5A9BD4]/10 border-l-4 border-[#5A9BD4] rounded-md p-2 overflow-hidden shadow-sm cursor-pointer"
            >
              <span className="text-[9px] font-bold text-[#5A9BD4] leading-none block mb-1">09:00 - 09:45</span>
              <span className="text-[11px] font-bold text-[#1C365C] leading-none block truncate">Arthur Morgan</span>
            </motion.div>

            {/* Sadie Adler Appointment */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute left-[calc((100%/7)*3+4px)] right-[calc(100%-(100%/7)*4+4px)] top-[50%] h-[30%] bg-[#E6CBB8]/20 border-l-4 border-[#E6CBB8] rounded-md p-2 overflow-hidden shadow-sm cursor-pointer"
            >
              <span className="text-[9px] font-bold text-[#E6CBB8] leading-none block mb-1">10:15 - 11:30</span>
              <span className="text-[11px] font-bold text-[#1C365C] leading-none block truncate">Sadie Adler</span>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
