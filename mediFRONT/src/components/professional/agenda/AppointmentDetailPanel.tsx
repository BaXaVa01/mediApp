import React from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { BriefcaseMedical, Clock, DollarSign, MapPin, CalendarClock, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const AppointmentDetailPanel: React.FC = () => {
  const selectedAppointment = useAgendaStore((state) => state.selectedAppointment);
  const { updateStatus, setRescheduleModalOpen } = useAgendaStore();

  if (!selectedAppointment) {
    return (
      <div className="w-[340px] bg-[#FDF9F3] flex flex-col items-center justify-center p-6 shrink-0 border-l border-[#1C365C]/5 text-center">
        <div className="w-16 h-16 bg-[#1C365C]/5 rounded-full flex items-center justify-center mb-4">
          <CalendarClock className="w-8 h-8 text-[#1C365C]/20" />
        </div>
        <p className="text-[#1C365C]/40 font-bold text-sm">Select an appointment<br/>to view details</p>
      </div>
    );
  }

  const apt = selectedAppointment;

  // Calculate duration in minutes
  const duration = Math.round((apt.endTime.getTime() - apt.startTime.getTime()) / 60000);

  return (
    <div className="w-[340px] bg-[#FDF9F3] overflow-y-auto custom-scrollbar flex flex-col p-6 shrink-0 border-l border-[#1C365C]/5">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-[#1C365C]/5 p-1 mb-4 relative">
          <img src={apt.patientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName)}&background=random`} alt={apt.patientName} className="w-full h-full rounded-full object-cover" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
             <div className={`w-2.5 h-2.5 rounded-full ${
               apt.status === 'confirmed' ? 'bg-[#5A9BD4]' :
               apt.status === 'completed' ? 'bg-[#A3C9A8]' :
               apt.status === 'cancelled' ? 'bg-rose-500' :
               'bg-[#E6CBB8]'
             }`} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#1C365C] text-center">{apt.patientName}</h2>
        <p className="text-[10px] text-[#1C365C]/40 uppercase tracking-widest font-bold mt-1">PATIENT ID: {apt.patientId}</p>
        <div className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${
          apt.status === 'confirmed' ? 'bg-[#5A9BD4]/10 text-[#5A9BD4]' :
          apt.status === 'completed' ? 'bg-[#A3C9A8]/20 text-[#A3C9A8]' :
          apt.status === 'cancelled' ? 'bg-rose-50 text-rose-500' :
          'bg-[#E6CBB8]/20 text-[#E6CBB8]'
        }`}>
          {apt.status}
        </div>
      </div>

      {/* Bento Details */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm">
          <BriefcaseMedical className="w-4 h-4 text-[#5A9BD4] mb-2" />
          <p className="text-[9px] uppercase tracking-widest text-[#1C365C]/40 font-bold">Service</p>
          <p className="text-sm font-bold text-[#1C365C] leading-tight mt-1 truncate">{apt.service}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm">
          <Clock className="w-4 h-4 text-[#5A9BD4] mb-2" />
          <p className="text-[9px] uppercase tracking-widest text-[#1C365C]/40 font-bold">Duration</p>
          <p className="text-sm font-bold text-[#1C365C] leading-tight mt-1">{duration} Min</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm">
          <DollarSign className="w-4 h-4 text-[#5A9BD4] mb-2" />
          <p className="text-[9px] uppercase tracking-widest text-[#1C365C]/40 font-bold">Price</p>
          <p className="text-sm font-bold text-[#1C365C] leading-tight mt-1">${apt.price.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm">
          <MapPin className="w-4 h-4 text-[#5A9BD4] mb-2" />
          <p className="text-[9px] uppercase tracking-widest text-[#1C365C]/40 font-bold">Modality</p>
          <p className="text-sm font-bold text-[#1C365C] leading-tight mt-1">{apt.modality}</p>
        </div>
        <div className="col-span-2 bg-white p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm flex items-start gap-4">
          <div className="p-2 bg-[#5A9BD4]/10 rounded-xl">
            <MapPin className="w-5 h-5 text-[#5A9BD4]" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] uppercase tracking-widest text-[#1C365C]/40 font-bold mb-1">Location</p>
            <p className="text-sm font-bold text-[#1C365C] leading-tight truncate">{apt.location}</p>
          </div>
        </div>
      </div>

      {/* Action Pills */}
      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setRescheduleModalOpen(true)} className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl border border-[#1C365C]/5 shadow-sm hover:border-[#1C365C]/10 transition-colors">
            <CalendarClock className="w-4 h-4 text-[#1C365C] mb-2" />
            <span className="text-xs font-bold text-[#1C365C]">Reschedule</span>
          </button>
          {apt.status === 'pending' ? (
            <button onClick={() => updateStatus(apt.id, 'confirmed')} className="flex flex-col items-center justify-center py-4 bg-[#5A9BD4] rounded-2xl shadow-sm hover:bg-[#4A8BC4] transition-colors group">
              <CheckCircle2 className="w-4 h-4 text-white mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Confirm</span>
            </button>
          ) : (
            <>
              <button className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl border border-[#1C365C]/5 shadow-sm hover:border-[#1C365C]/10 transition-colors">
                <Send className="w-4 h-4 text-[#1C365C] mb-2" />
                <span className="text-xs font-bold text-[#1C365C]">Reminder</span>
              </button>
              <button onClick={() => updateStatus(apt.id, 'completed')} className="flex flex-col items-center justify-center py-4 bg-[#1C365C] rounded-2xl shadow-sm hover:bg-[#2C466C] transition-colors group">
                <CheckCircle2 className="w-4 h-4 text-white mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Complete</span>
              </button>
            </>
          )}
        </div>
      )}

      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
        <button onClick={() => updateStatus(apt.id, 'cancelled')} className="text-xs font-bold text-rose-500 hover:text-rose-600 mb-8 text-center transition-colors">
          Cancel Appointment
        </button>
      )}

      <div className="mt-auto space-y-4 pt-4 border-t border-[#1C365C]/5">
        <div className="flex justify-between items-center cursor-pointer group">
          <span className="text-sm font-bold text-[#1C365C] group-hover:text-[#5A9BD4] transition-colors">Internal Clinical Notes</span>
          <ChevronDown className="w-4 h-4 text-[#1C365C]/40 group-hover:text-[#5A9BD4] transition-colors" />
        </div>
        <div className="w-full h-px bg-[#1C365C]/5" />
        <div className="flex justify-between items-center cursor-pointer group">
          <span className="text-sm font-bold text-[#1C365C] group-hover:text-[#5A9BD4] transition-colors">Patient History</span>
          <ChevronDown className="w-4 h-4 text-[#1C365C]/40 group-hover:text-[#5A9BD4] transition-colors" />
        </div>
      </div>
    </div>
  );
};