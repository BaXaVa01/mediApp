import React from 'react';
import { Bell, Search } from 'lucide-react';
import { mockDoctors } from '../../utils/mockData';
import logo from '../../assets/logo_pro.png';

export const Topbar: React.FC = () => {
  const doctor = mockDoctors[0]; // Simulating logged in doctor

  return (
    <header className="h-20 bg-white border-b border-[#E6CBB8]/30 px-8 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-12 flex-1">
        <img src={logo} alt="MediFind" className="h-14 w-auto object-contain" />
        
        <div className="relative max-w-xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar pacientes, citas..." 
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-[#5A9BD4] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-[#1C365C]">{doctor.name}</p>
            <p className="text-[10px] text-[#5A9BD4] font-bold uppercase tracking-widest">{doctor.specialty}</p>
          </div>
          <img src={doctor.photo} alt={doctor.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#5A9BD4]/20" />
        </div>
      </div>
    </header>
  );
};
