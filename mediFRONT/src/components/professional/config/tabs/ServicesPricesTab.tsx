import React, { useState } from 'react';
import { useConfigStore } from '../../../../store/configStore';
import { EmptyState } from '../SystemStates';
import { Stethoscope, Plus, Search, Edit2, Trash2, Clock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesPricesTab: React.FC = () => {
  const { services, deleteService, addService } = useConfigStore();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setProcessing(id);
    await deleteService(id);
    setProcessing(null);
  };

  const handleAddMock = async () => {
    setProcessing('add');
    await addService({
      name: 'Nueva Consulta (Mock)',
      description: 'Consulta general agregada de prueba.',
      price: 100,
      duration: 30,
      modality: 'Both',
      visible: true,
      confirmationMode: 'Manual'
    });
    setProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Servicios y Precios</h2>
          <p className="text-[#1C365C]/60 text-sm mt-1">Administra tu catálogo de servicios, precios y duraciones.</p>
        </div>
        <Button onClick={handleAddMock} disabled={processing === 'add'} className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] px-6 h-12 rounded-xl font-bold flex items-center gap-2 shadow-sm disabled:opacity-50">
          {processing === 'add' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Nuevo Servicio
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C365C]/30" />
        <input 
          type="text" 
          placeholder="Buscar servicios..." 
          className="w-full bg-white border border-[#1C365C]/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all shadow-sm"
        />
      </div>

      {services.length === 0 ? (
        <EmptyState 
          icon={<Stethoscope className="w-8 h-8" />}
          title="Sin servicios configurados"
          description="Añade los servicios que ofreces para que los pacientes puedan agendar citas contigo."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {services.map(service => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white p-6 rounded-[2rem] border border-[#1C365C]/5 shadow-sm hover:shadow-[0_10px_30px_rgba(28,54,92,0.03)] hover:border-[#1C365C]/10 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#FDF9F3] rounded-2xl flex items-center justify-center text-[#5A9BD4] border border-[#1C365C]/5 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-[#1C365C]/40 hover:text-[#5A9BD4] bg-[#FDF9F3] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(service.id)} disabled={processing === service.id} className="p-2 text-[#1C365C]/40 hover:text-rose-500 bg-[#FDF9F3] rounded-lg transition-colors disabled:opacity-50">
                        {processing === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-[#1C365C] mb-2 leading-tight">{service.name}</h3>
                  <p className="text-sm text-[#1C365C]/50 font-medium mb-6 line-clamp-2">{service.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-xs bg-[#FDF9F3] px-3 py-1.5 rounded-lg font-bold text-[#1C365C]/70">
                      <Clock className="w-3.5 h-3.5" /> {service.duration} min
                    </span>
                    <span className="flex items-center gap-1.5 text-xs bg-[#FDF9F3] px-3 py-1.5 rounded-lg font-bold text-[#1C365C]/70">
                      <Globe className="w-3.5 h-3.5" /> {service.modality}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between pt-4 border-t border-[#1C365C]/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-[#1C365C]/40 font-bold mb-0.5">Precio</span>
                      <span className="font-black text-2xl text-[#1C365C]">${service.price}</span>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${service.confirmationMode === 'Automatic' ? 'bg-[#A3C9A8]/20 text-[#A3C9A8]' : 'bg-[#E6CBB8]/20 text-[#E6CBB8]'}`}>
                      {service.confirmationMode}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};