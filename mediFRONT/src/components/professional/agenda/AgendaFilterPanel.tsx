import React from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { ChevronLeft, ChevronRight, CheckCircle2, MapPin, ClipboardList } from 'lucide-react';

export const AgendaFilterPanel: React.FC = () => {
  const { activeFilters, toggleFilter, setPendingDrawerOpen, pendingRequests, currentDate, nextDate, prevDate, goToToday } = useAgendaStore();

  // Mini calendar dummy data
  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  // Real dates for mini calendar based on currentDate
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  const startDay = startOfMonth.getDay();
  const monthDays = endOfMonth.getDate();

  const calendarDates = [];
  // Prev month padding
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDates.push({ day: prevMonthEnd.getDate() - i, current: false });
  }
  // Current month
  for (let i = 1; i <= monthDays; i++) {
    calendarDates.push({ day: i, current: true });
  }
  // Next month padding
  const remaining = 42 - calendarDates.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDates.push({ day: i, current: false });
  }

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="w-[280px] bg-[#FDF9F3] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 shrink-0">

      {/* Mini Calendar */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(28,54,92,0.03)] border border-[#1C365C]/5">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-[#1C365C] text-sm">{monthLabel}</h3>
          <div className="flex gap-2 text-[#1C365C]/40">
            <ChevronLeft onClick={prevDate} className="w-4 h-4 cursor-pointer hover:text-[#1C365C] transition-colors" />
            <ChevronRight onClick={nextDate} className="w-4 h-4 cursor-pointer hover:text-[#1C365C] transition-colors" />
          </div>
        </div>
        <div className="grid grid-cols-7 text-center mb-2">
          {days.map(d => <span key={d} className="text-[9px] font-bold text-[#1C365C]/30">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-[#1C365C]">
          {calendarDates.map((d, i) => (
            <div key={i} className="flex justify-center items-center py-1">
              <span className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all ${!d.current ? 'text-[#1C365C]/20' : ''} ${d.current && d.day === currentDate.getDate() ? 'bg-[#5A9BD4] text-white shadow-lg shadow-[#5A9BD4]/30' : 'hover:bg-[#FDF9F3]'}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
        <button 
          onClick={goToToday}
          className="w-full mt-4 py-2 bg-[#FDF9F3] text-[#5A9BD4] font-bold text-xs rounded-xl hover:bg-[#5A9BD4]/10 transition-colors"
        >
          Today
        </button>
      </div>


      {/* Quick Filters */}
      <div>
        <h3 className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest mb-3 px-1">Quick Filters</h3>
        <div className="space-y-2">
          <button 
            onClick={() => toggleFilter('confirmed')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${activeFilters.includes('confirmed') ? 'bg-[#5A9BD4]/10 border border-[#5A9BD4]/20' : 'bg-white border border-[#1C365C]/5 hover:border-[#1C365C]/10 shadow-sm'}`}
          >
            <div className="flex items-center gap-3 text-[#1C365C] font-semibold text-sm">
              <CheckCircle2 className={`w-4 h-4 ${activeFilters.includes('confirmed') ? 'text-[#5A9BD4]' : 'text-[#1C365C]/30'}`} />
              Confirmed
            </div>
            <div className="w-2 h-2 rounded-full bg-[#5A9BD4]" />
          </button>
          
          <button 
            onClick={() => toggleFilter('In-Person')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${activeFilters.includes('In-Person') ? 'bg-[#5A9BD4]/10 border border-[#5A9BD4]/20' : 'bg-white border border-[#1C365C]/5 hover:border-[#1C365C]/10 shadow-sm'}`}
          >
            <div className="flex items-center gap-3 text-[#1C365C] font-semibold text-sm">
              <CheckCircle2 className={`w-4 h-4 ${activeFilters.includes('In-Person') ? 'text-[#5A9BD4]' : 'text-[#1C365C]/30'}`} />
              In-person
            </div>
            <MapPin className="w-4 h-4 text-[#1C365C]/30" />
          </button>
        </div>
      </div>

      {/* Pending Requests Card */}
      <div 
        onClick={() => setPendingDrawerOpen(true)}
        className="bg-[#E6CBB8]/20 rounded-3xl p-5 border border-[#E6CBB8]/30 relative overflow-hidden group cursor-pointer hover:bg-[#E6CBB8]/30 transition-colors mt-auto mb-4"
      >
        <ClipboardList className="absolute -bottom-4 -right-4 w-24 h-24 text-[#E6CBB8]/40 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10">
          <h4 className="text-[10px] font-bold text-[#1C365C]/50 uppercase tracking-widest mb-1">Pending Requests</h4>
          <p className="text-4xl font-black text-[#1C365C] mb-4">{pendingRequests.length}</p>
          <div className="flex items-center gap-1 text-xs font-bold text-[#1C365C]/70">
            Action required <span className="text-[#1C365C]">→</span>
          </div>
        </div>
      </div>

    </div>
  );
};
