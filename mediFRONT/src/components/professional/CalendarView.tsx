import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalendarView: React.FC = () => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = new Date().getDate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E6CBB8]/30 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1C365C]">Mayo 2026</h2>
          <p className="text-xs text-[#5A9BD4] font-bold uppercase tracking-widest mt-1">Vista Mensual</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft className="w-4 h-4 text-[#1C365C]" /></button>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight className="w-4 h-4 text-[#1C365C]" /></button>
          </div>
          <Button variant="primary" size="sm" className="gap-2 px-4 shadow-md">
            <Plus className="w-4 h-4" /> Nueva Cita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {days.map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {/* Placeholder for previous month days */}
        {[...Array(5)].map((_, i) => (
          <div key={`empty-${i}`} className="border-r border-b border-slate-50 p-2 min-h-[100px] bg-slate-50/20" />
        ))}
        
        {monthDays.map((day) => {
          const isToday = day === currentDay;
          const hasAppts = [7, 12, 15, 20, 25].includes(day);
          
          return (
            <div 
              key={day} 
              className={`border-r border-b border-slate-50 p-2 min-h-[100px] hover:bg-[#FDF9F3]/50 transition-colors cursor-pointer group relative ${isToday ? 'bg-[#5A9BD4]/5' : ''}`}
            >
              <span className={`text-xs font-bold ${isToday ? 'bg-[#5A9BD4] text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-[#1C365C]'}`}>
                {day}
              </span>
              
              {hasAppts && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-[#5A9BD4]/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#5A9BD4] rounded-full" />
                  </div>
                  <p className="text-[8px] font-bold text-[#4A628A] uppercase truncate">3 Citas</p>
                </div>
              )}

              {isToday && (
                <div className="mt-2 p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                   <p className="text-[8px] font-black text-emerald-700 uppercase leading-none mb-1">9:00 AM</p>
                   <p className="text-[9px] font-bold text-[#1C365C] truncate">Juan Pérez</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
