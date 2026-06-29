import React, { useState } from 'react';
import { useConfigStore } from '../../../../store/configStore';
import { EmptyState } from '../SystemStates';
import { CalendarOff, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const AvailabilityBlocksTab: React.FC = () => {
  const { blocks, deleteBlock, addBlock } = useConfigStore();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setProcessing(id);
    await deleteBlock(id);
    setProcessing(null);
  };

  const handleAddMock = async () => {
    setProcessing('add');
    await addBlock({
      date: new Date(),
      allDay: true,
      reason: 'Congreso Médico'
    });
    setProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Bloqueos de Fechas</h2>
          <p className="text-[#1C365C]/60 text-sm mt-1">Configura vacaciones, días festivos o ausencias temporales.</p>
        </div>
        <Button onClick={handleAddMock} disabled={processing === 'add'} className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] px-6 h-12 rounded-xl font-bold flex items-center gap-2 shadow-sm disabled:opacity-50">
          {processing === 'add' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Nuevo Bloqueo
        </Button>
      </div>

      {blocks.length === 0 ? (
        <EmptyState 
          icon={<CalendarOff className="w-8 h-8" />}
          title="Sin bloqueos activos"
          description="Actualmente no tienes fechas bloqueadas en tu calendario."
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {blocks.map(block => (
              <motion.div 
                key={block.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white p-6 rounded-[2rem] border border-[#1C365C]/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#1C365C]/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100">
                    <CalendarOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1C365C] text-lg">{block.reason}</h3>
                    <p className="text-sm font-medium text-[#1C365C]/60">
                      {block.date.toLocaleDateString()} {block.allDay ? '(Todo el día)' : `• ${block.startTime} - ${block.endTime}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-[#FDF9F3] text-[#1C365C] hover:bg-white rounded-xl border border-[#1C365C]/5 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(block.id)} disabled={processing === block.id} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center">
                    {processing === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};