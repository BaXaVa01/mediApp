import React from 'react';
import { useConfigStore } from '../../../../store/configStore';
import { SaveToast } from '../SystemStates';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '../../../ui/Button';

export const RemindersTab: React.FC = () => {
  const { reminders, updateReminders, isSaving, saveSuccess } = useConfigStore();

  if (!reminders) return null;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Recordatorios</h2>
        <p className="text-[#1C365C]/60 text-sm mt-1">Configura las notificaciones automáticas para ti y tus pacientes.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Patient Reminders */}
        <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A9BD4]/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#5A9BD4]/10 rounded-xl">
                <Smartphone className="w-5 h-5 text-[#5A9BD4]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C365C]">Para el paciente</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={reminders.patient.enabled} onChange={() => {}} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
            </label>
          </div>
          <p className="text-sm text-[#1C365C]/60 mb-6">Los pacientes recibirán un mensaje por WhatsApp o Email antes de su cita.</p>
          
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1C365C]/40">Enviar recordatorio:</p>
            {['24h antes', '12h antes', '2h antes'].map(time => (
              <label key={time} className="flex items-center gap-3 p-3 rounded-xl border border-[#1C365C]/5 hover:bg-[#FDF9F3] cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked={time === '24h antes' || time === '2h antes'} className="rounded border-slate-300 text-[#5A9BD4] focus:ring-[#5A9BD4]" />
                <span className="text-sm font-bold text-[#1C365C]">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Doctor Reminders */}
        <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6CBB8]/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E6CBB8]/20 rounded-xl">
                <Monitor className="w-5 h-5 text-[#E6CBB8]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C365C]">Para ti (Doctor)</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={reminders.doctor.enabled} onChange={() => {}} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
            </label>
          </div>
          <p className="text-sm text-[#1C365C]/60 mb-6">Recibirás una notificación push en la plataforma y/o correo electrónico.</p>
          
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1C365C]/40">Avisarme:</p>
            <select className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20">
              <option value="15min">15 minutos antes</option>
              <option value="30min">30 minutos antes</option>
              <option value="1h">1 hora antes</option>
              <option value="2h">2 horas antes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={() => updateReminders(reminders)} disabled={isSaving} className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-8 h-12 rounded-xl font-bold shadow-md">
          {isSaving ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>

      <SaveToast visible={saveSuccess} />
    </div>
  );
};