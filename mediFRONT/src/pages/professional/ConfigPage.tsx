import { useState, useEffect } from 'react';
import { useConfigStore } from '../../store/configStore';
import { LoadingState } from '../../components/professional/config/SystemStates';

import { PendingRequestsTab } from '../../components/professional/config/tabs/PendingRequestsTab';
import { WeeklyScheduleTab } from '../../components/professional/config/tabs/WeeklyScheduleTab';
import { AvailabilityBlocksTab } from '../../components/professional/config/tabs/AvailabilityBlocksTab';
import { ServicesPricesTab } from '../../components/professional/config/tabs/ServicesPricesTab';
import { RemindersTab } from '../../components/professional/config/tabs/RemindersTab';
import { AppointmentRulesTab } from '../../components/professional/config/tabs/AppointmentRulesTab';

export default function ConfigPage() {
  const { fetchConfig, isLoading } = useConfigStore();
  const [activeTab, setActiveTab] = useState('solicitudes');

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const tabs = [
    { id: 'solicitudes', label: 'Solicitudes Pendientes', component: <PendingRequestsTab /> },
    { id: 'horarios', label: 'Horarios de Atención', component: <WeeklyScheduleTab /> },
    { id: 'bloqueos', label: 'Bloqueos de Fechas', component: <AvailabilityBlocksTab /> },
    { id: 'servicios', label: 'Servicios y Precios', component: <ServicesPricesTab /> },
    { id: 'recordatorios', label: 'Recordatorios', component: <RemindersTab /> },
    { id: 'reglas', label: 'Reglas de Citas', component: <AppointmentRulesTab /> }
  ];

  return (
    <div className="h-[100vh] flex bg-[#FDF9F3] overflow-hidden">
      <div className="w-[300px] bg-[#FDF9F3] p-8 space-y-3 overflow-y-auto shrink-0 border-r border-[#1C365C]/5 shadow-[20px_0_40px_-20px_rgba(28,54,92,0.03)] z-10">
        <h2 className="text-3xl font-black text-[#1C365C] mb-8 tracking-tight">Ajustes</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-4 rounded-[1.2rem] font-bold transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-white text-[#5A9BD4] shadow-sm border border-[#1C365C]/5' 
                  : 'text-[#1C365C]/60 hover:bg-white/50 hover:text-[#1C365C] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-white overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <LoadingState />
          ) : (
            tabs.find(t => t.id === activeTab)?.component
          )}
        </div>
      </div>
    </div>
  );
}
