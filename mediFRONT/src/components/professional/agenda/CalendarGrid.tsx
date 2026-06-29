import React, { useEffect } from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentBlock } from './AppointmentBlock';
import { motion, AnimatePresence } from 'framer-motion';

export const CalendarGrid: React.FC = () => {
  const { viewMode, setViewMode, currentDate, appointments, activeFilters, fetchData, nextDate, prevDate } = useAgendaStore();

  useEffect(() => {
    fetchData();
  }, [fetchData, currentDate, viewMode]);

  // Generate days based on viewMode
  const getDays = () => {
    if (viewMode === 'daily') {
      const isToday = currentDate.toDateString() === new Date(2026, 5, 4).toDateString();
      return [{
        date: currentDate,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: currentDate.getDate().toString(),
        isToday
      }];
    }
    
    // Weekly view: get start of week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isToday = d.toDateString() === new Date(2026, 5, 4).toDateString();
      return {
        date: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: d.getDate().toString(),
        isToday
      };
    });
  };

  const days = getDays();
  const times = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8; // 08:00 to 18:00
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const filteredAppointments = appointments.filter(apt => 
    (activeFilters.includes(apt.status) || activeFilters.includes(apt.modality))
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#1C365C]/5">
        <div className="flex items-center gap-6">
          <motion.h2 
            key={currentDate.toISOString()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-[#1C365C] tracking-tight min-w-[280px]"
          >
            {viewMode === 'weekly' ? 'Week view' : 'Day view'} • {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </motion.h2>
          <div className="flex gap-2">
            <button onClick={prevDate} className="p-2 hover:bg-[#FDF9F3] rounded-full transition-colors border border-[#1C365C]/5 text-[#1C365C]/40 hover:text-[#5A9BD4]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextDate} className="p-2 hover:bg-[#FDF9F3] rounded-full transition-colors border border-[#1C365C]/5 text-[#1C365C]/40 hover:text-[#5A9BD4]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#FDF9F3] p-1 rounded-xl border border-[#1C365C]/5">
            <button 
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all relative ${viewMode === 'weekly' ? 'text-[#5A9BD4]' : 'text-[#1C365C]/50 hover:text-[#1C365C]'}`}
            >
              {viewMode === 'weekly' && <motion.div layoutId="viewSwitch" className="absolute inset-0 bg-white shadow-sm rounded-lg" />}
              <span className="relative z-10">Week</span>
            </button>
            <button 
              onClick={() => setViewMode('daily')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all relative ${viewMode === 'daily' ? 'text-[#5A9BD4]' : 'text-[#1C365C]/50 hover:text-[#1C365C]'}`}
            >
              {viewMode === 'daily' && <motion.div layoutId="viewSwitch" className="absolute inset-0 bg-white shadow-sm rounded-lg" />}
              <span className="relative z-10">Day</span>
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

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex flex-col min-h-full">
          {/* Grid Header (Days) */}
          <div className="flex border-b border-[#1C365C]/5 sticky top-0 bg-white/80 backdrop-blur-md z-20">
            <div className="w-16 shrink-0 border-r border-[#1C365C]/5"></div>
            {days.map((d, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center justify-center py-4 border-r border-[#1C365C]/5 last:border-0`}>
                <span className={`text-[10px] font-bold tracking-widest mb-1 ${d.isToday ? 'text-[#5A9BD4]' : 'text-[#1C365C]/40'}`}>{d.dayName}</span>
                <span className={`text-xl font-bold ${d.isToday ? 'text-[#5A9BD4]' : 'text-[#1C365C]'}`}>{d.dayNum}</span>
                {d.isToday && <div className="w-1 h-1 rounded-full bg-[#5A9BD4] mt-1" />}
              </div>
            ))}
          </div>

          <div className="flex flex-1 relative">
            {/* Time Labels Column */}
            <div className="w-16 shrink-0 border-r border-[#1C365C]/5 flex flex-col relative z-10 bg-white">
              {times.map((t, i) => (
                <div key={i} className="h-[60px] border-b border-[#1C365C]/5 relative">
                  <span className="absolute -top-2.5 right-2 text-[9px] font-semibold text-[#1C365C]/30">{t}</span>
                </div>
              ))}
            </div>
            
            {/* Days Columns */}
            <div className="flex-1 flex relative">
              {/* Horizontal lines for the whole grid */}
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                {times.map((_, j) => (
                  <div key={j} className="h-[60px] border-b border-[#1C365C]/5 w-full"></div>
                ))}
              </div>

              {/* Vertical column dividers */}
              {days.map((_, i) => (
                <div key={i} className={`flex-1 border-r border-[#1C365C]/5 last:border-0 relative`}>
                </div>
              ))}
              
              {/* Events mapping */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentDate.toISOString() + viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {filteredAppointments.map(apt => {
                    let dayIndex = 0;
                    const aptDate = new Date(apt.startTime);
                    
                    if (viewMode === 'weekly') {
                      // Get index relative to start of week (Sunday)
                      dayIndex = aptDate.getDay();
                    } else {
                      // Daily view: only one column
                      dayIndex = 0;
                    }

                    return (
                      <AppointmentBlock 
                        key={apt.id} 
                        apt={apt} 
                        dayIndex={dayIndex} 
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
