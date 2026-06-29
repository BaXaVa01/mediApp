import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgendaStore } from '../../../store/agendaStore';

export const RescheduleModal: React.FC = () => {
  const { isRescheduleModalOpen, setRescheduleModalOpen, selectedAppointment, reschedule } = useAgendaStore();

  if (!selectedAppointment) return null;

  const handleReschedule = () => {
    // Mock new time: +1 day
    const newStart = new Date(selectedAppointment.startTime);
    newStart.setDate(newStart.getDate() + 1);
    const newEnd = new Date(selectedAppointment.endTime);
    newEnd.setDate(newEnd.getDate() + 1);
    
    reschedule(selectedAppointment.id, newStart, newEnd);
    setRescheduleModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-[#1C365C]/40 backdrop-blur-sm"
            onClick={() => setRescheduleModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl z-[201]"
          >
            <h2 className="text-2xl font-bold text-[#1C365C] mb-2">Reschedule Appointment</h2>
            <p className="text-[#1C365C]/60 text-sm mb-6">Select a new time for {selectedAppointment.patientName}.</p>
            
            <div className="bg-[#FDF9F3] p-4 rounded-2xl border border-[#1C365C]/5 mb-8 text-center text-[#1C365C] font-bold cursor-pointer hover:bg-[#5A9BD4]/10 transition-colors">
              [Mock] Move to Tomorrow
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setRescheduleModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-[#1C365C] border border-[#1C365C]/10 hover:bg-[#FDF9F3] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReschedule}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#5A9BD4] hover:bg-[#4A8BC4] shadow-md shadow-[#5A9BD4]/20 transition-all active:scale-95"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};