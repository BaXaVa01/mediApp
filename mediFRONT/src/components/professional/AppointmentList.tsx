import React from 'react';
import type { Appointment } from '../../types/doctor';
import { Clock, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const AppointmentList: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmada': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Cancelada': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Urgencia': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Seguimiento': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E6CBB8]/30 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#1C365C]">Citas de Hoy</h2>
        <span className="text-xs font-bold text-[#5A9BD4] bg-[#5A9BD4]/10 px-3 py-1 rounded-full uppercase tracking-wider">
          {appointments.length} CITAS
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FDF9F3] border border-[#E6CBB8]/30 flex flex-col items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold text-[#4A628A] uppercase">{apt.time.split(':')[0] >= '12' ? 'PM' : 'AM'}</span>
                  <span className="text-sm font-black text-[#1C365C]">{apt.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <User className="w-3.5 h-3.5 text-[#5A9BD4]" />
                    <h3 className="font-bold text-[#1C365C]">{apt.patientName}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter ${getTypeColor(apt.type)}`}>
                      {apt.type}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(apt.status)}
                      <span className="text-[10px] font-medium text-slate-500">{apt.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No hay citas programadas para hoy.</p>
          </div>
        )}
      </div>
    </div>
  );
};
