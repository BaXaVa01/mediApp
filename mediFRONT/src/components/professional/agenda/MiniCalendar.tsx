import React from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MiniCalendar: React.FC = () => {
  const { currentDate, setCurrentDate } = useAgendaStore();

  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  // Basic mock date generation for current month
  const today = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayIndex + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    setCurrentDate(newDate);
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === currentDate.getDate();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(28,54,92,0.03)] border border-[#1C365C]/5">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-[#1C365C] text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2 text-[#1C365C]/40">
          <ChevronLeft onClick={handlePrevMonth} className="w-4 h-4 cursor-pointer hover:text-[#1C365C] transition-colors" />
          <ChevronRight onClick={handleNextMonth} className="w-4 h-4 cursor-pointer hover:text-[#1C365C] transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {daysOfWeek.map(d => (
          <span key={d} className="text-[9px] font-bold text-[#1C365C]/30">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-[#1C365C]">
        {days.map((d, i) => (
          <div key={i} className="flex justify-center items-center">
            {d ? (
              <span 
                onClick={() => selectDate(d)}
                className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                  isSelected(d) ? 'bg-[#1C365C] text-white shadow-md' : 
                  isToday(d) ? 'bg-[#5A9BD4]/10 text-[#5A9BD4] font-bold' : 
                  'hover:bg-[#FDF9F3]'
                }`}
              >
                {d}
              </span>
            ) : <span />}
          </div>
        ))}
      </div>
      <button 
        onClick={() => setCurrentDate(new Date())}
        className="w-full mt-4 py-2 bg-[#FDF9F3] text-[#5A9BD4] font-bold text-xs rounded-xl hover:bg-[#5A9BD4]/10 transition-colors"
      >
        Today
      </button>
    </div>
  );
};