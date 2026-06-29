import React from 'react';
import { useConfigStore } from '../../../../store/configStore';
import { SaveToast } from '../SystemStates';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../../ui/Button';

export const AppointmentRulesTab: React.FC = () => {
  const { rules, updateRules, isSaving, saveSuccess } = useConfigStore();

  if (!rules) return null;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Reglas de Citas</h2>
        <p className="text-[#1C365C]/60 text-sm mt-1">Políticas de agendamiento, cancelación y comportamiento automático.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#1C365C]/5">
          <div className="p-3 bg-rose-50 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1C365C]">Límites de Agendamiento</h3>
            <p className="text-xs text-[#1C365C]/50 font-medium">Define con cuánta anticipación pueden reservar los pacientes.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1C365C]/60 uppercase tracking-widest">Tiempo mínimo de reserva</label>
            <div className="flex items-center gap-3">
              <input type="number" defaultValue={rules.minTimeBeforeBooking} className="w-24 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] text-center" />
              <span className="text-sm font-medium text-[#1C365C]/50">horas antes de la cita</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1C365C]/60 uppercase tracking-widest">Anticipación máxima</label>
            <div className="flex items-center gap-3">
              <input type="number" defaultValue={rules.maxDaysInAdvance} className="w-24 bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] text-center" />
              <span className="text-sm font-medium text-[#1C365C]/50">días en el futuro</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#1C365C] mb-6 pt-6 border-t border-[#1C365C]/5">Políticas del Paciente</h3>
        
        <div className="space-y-4">
          {[
            { label: 'Confirmación automática de citas', desc: 'Las citas se confirman sin requerir tu aprobación manual.', checked: rules.autoConfirm },
            { label: 'Permitir citas en línea', desc: 'Habilita la videoconsulta como modalidad en tu perfil.', checked: rules.allowOnline },
            { label: 'Permitir cancelaciones del paciente', desc: 'Los pacientes pueden cancelar desde su perfil.', checked: rules.allowPatientCancel },
            { label: 'Permitir reprogramación', desc: 'Los pacientes pueden cambiar la fecha/hora de su cita.', checked: rules.allowReschedule },
          ].map((policy, i) => (
            <div key={i} className="flex items-start justify-between p-4 rounded-2xl border border-[#1C365C]/5 hover:bg-[#FDF9F3]/50 transition-colors">
              <div>
                <p className="font-bold text-[#1C365C] mb-0.5">{policy.label}</p>
                <p className="text-xs font-medium text-[#1C365C]/50">{policy.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input type="checkbox" className="sr-only peer" defaultChecked={policy.checked} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={() => updateRules(rules)} disabled={isSaving} className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-8 h-12 rounded-xl font-bold shadow-md">
          {isSaving ? 'Guardando...' : 'Guardar Reglas'}
        </Button>
      </div>

      <SaveToast visible={saveSuccess} />
    </div>
  );
};