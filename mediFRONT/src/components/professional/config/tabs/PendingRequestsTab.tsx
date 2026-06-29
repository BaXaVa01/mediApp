import React, { useState } from 'react';
import { useAgendaStore } from '../../../../store/agendaStore';
import { EmptyState } from '../SystemStates';
import { ClipboardList, CheckCircle2, XCircle, Clock, Loader2, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PendingRequestsTab: React.FC = () => {
  const { pendingRequests, acceptRequest, rejectRequest, proposeTime } = useAgendaStore();
  const [processing, setProcessing] = useState<string | null>(null);
  const [proposingFor, setProposingFor] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'accept' | 'reject' | 'propose') => {
    if (action === 'propose') {
      setProcessing(id);
      await proposeTime(id, new Date());
      setProcessing(null);
      setProposingFor(null);
      return;
    }

    setProcessing(id);
    if (action === 'accept') {
      await acceptRequest(id);
    } else {
      await rejectRequest(id);
    }
    setProcessing(null);
  };

  if (pendingRequests.length === 0) {
    return (
      <EmptyState 
        icon={<ClipboardList className="w-8 h-8" />}
        title="Sin solicitudes pendientes"
        description="No tienes solicitudes de citas pendientes por revisar en este momento."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Solicitudes Pendientes</h2>
          <p className="text-[#1C365C]/60 text-sm mt-1">Revisa y gestiona las solicitudes de citas de tus pacientes.</p>
        </div>
        <div className="bg-[#E6CBB8]/20 text-[#E6CBB8] font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {pendingRequests.length} pendientes
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {pendingRequests.map(req => (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white p-6 rounded-[2rem] border border-[#1C365C]/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#5A9BD4]/10 flex items-center justify-center text-[#5A9BD4] font-bold text-xl border border-[#5A9BD4]/20">
                  {req.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#1C365C]">{req.patientName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-[#1C365C]/40 uppercase tracking-widest bg-[#FDF9F3] px-2 py-1 rounded-md">{req.modality}</span>
                    <span className="text-sm text-[#1C365C]/60 font-medium">{req.service}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1">
                 <span className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Fecha solicitada</span>
                 <span className="font-bold text-[#1C365C]">{req.requestedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(req.id, 'accept')}
                    disabled={processing !== null}
                    className="flex-1 md:flex-none bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4]/20 disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {processing === req.id && !proposingFor ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Aceptar
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'reject')}
                    disabled={processing !== null}
                    className="flex-1 md:flex-none bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {processing === req.id && !proposingFor ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Rechazar
                  </button>
                </div>
                <button 
                  onClick={() => setProposingFor(req.id)}
                  disabled={processing !== null}
                  className="w-full bg-[#FDF9F3] text-[#1C365C] hover:bg-white border border-[#1C365C]/5 hover:border-[#1C365C]/10 disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarClock className="w-4 h-4" /> Proponer otra fecha
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Propose Time Modal */}
      <AnimatePresence>
        {proposingFor && (
          <div className="fixed inset-0 flex items-center justify-center z-[200]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#1C365C]/40 backdrop-blur-sm"
              onClick={() => setProposingFor(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl z-[201]"
            >
              <h2 className="text-2xl font-bold text-[#1C365C] mb-2">Proponer nuevo horario</h2>
              <p className="text-[#1C365C]/60 text-sm mb-6">Selecciona una fecha y hora alternativa para esta cita.</p>
              
              <div className="bg-[#FDF9F3] p-4 rounded-2xl border border-[#1C365C]/5 mb-8 text-center text-[#1C365C] font-bold">
                <input type="datetime-local" className="bg-transparent border-none text-[#1C365C] font-bold focus:ring-0" />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setProposingFor(null)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[#1C365C] border border-[#1C365C]/10 hover:bg-[#FDF9F3] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleAction(proposingFor, 'propose')}
                  disabled={processing === proposingFor}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#5A9BD4] hover:bg-[#4A8BC4] shadow-md shadow-[#5A9BD4]/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing === proposingFor ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Propuesta'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};