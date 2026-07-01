import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgendaStore } from '../../../store/agendaStore';
import { X, CheckCircle2, XCircle } from 'lucide-react';

export const PendingRequestsDrawer: React.FC = () => {
  const { isPendingDrawerOpen, setPendingDrawerOpen, pendingRequests, acceptRequest, rejectRequest, pendingError } = useAgendaStore();

  let statusMessage = '';
  if (pendingError) {
    if (pendingError.includes('paginación') || pendingError.includes('PAGINATION') || pendingError.includes('INVALID_PAGINATION')) {
      statusMessage = 'No pudimos cargar las solicitudes pendientes. Revisá los parámetros de paginación.';
    } else {
      statusMessage = 'No pudimos cargar tus solicitudes pendientes. Intentá nuevamente.';
    }
  } else if (pendingRequests.length === 0) {
    statusMessage = 'No tenés solicitudes pendientes por aceptar.';
  }

  return (
    <AnimatePresence>
      {isPendingDrawerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setPendingDrawerOpen(false)}
            className="fixed inset-0 bg-[#1C365C]/20 backdrop-blur-sm z-[100]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[400px] bg-[#FDF9F3] shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-[#1C365C]/5 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-bold text-[#1C365C]">Pending Requests</h2>
                <p className="text-sm text-[#1C365C]/60">{pendingRequests.length} requests await action</p>
              </div>
              <button onClick={() => setPendingDrawerOpen(false)} className="w-8 h-8 rounded-full bg-[#FDF9F3] flex items-center justify-center hover:bg-[#1C365C]/5 transition-colors">
                <X className="w-4 h-4 text-[#1C365C]" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {pendingError ? (
                <div className="text-center text-red-500 font-bold mt-10 px-4">
                  {statusMessage}
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center text-[#1C365C]/40 font-bold mt-10">
                  {statusMessage}
                </div>
              ) : (
                pendingRequests.map(req => (
                  <div key={req.id} className="bg-white p-5 rounded-3xl border border-[#1C365C]/5 shadow-sm">
                    <p className="text-[10px] font-bold text-[#E6CBB8] uppercase tracking-widest mb-1">{req.requestedDate.toLocaleDateString()}</p>
                    <h3 className="font-bold text-lg text-[#1C365C]">{req.patientName}</h3>
                    <p className="text-sm text-[#1C365C]/60 mb-4">{req.service} • {req.modality}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => acceptRequest(req.id)}
                        className="flex-1 bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4]/20 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept
                      </button>
                      <button 
                        onClick={() => rejectRequest(req.id)}
                        className="flex-1 bg-rose-50 text-rose-500 hover:bg-rose-100 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};