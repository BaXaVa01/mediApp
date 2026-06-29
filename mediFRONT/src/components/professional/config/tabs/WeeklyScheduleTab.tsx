import React from 'react';
import { useConfigStore } from '../../../../store/configStore';
import { SaveToast } from '../SystemStates';
import { Clock, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../ui/Button';

export const WeeklyScheduleTab: React.FC = () => {
  const { schedule, updateScheduleDay, saveSchedule, isSaving, saveSuccess } = useConfigStore();

  if (!schedule) return null;

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ] as const;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Horario Semanal</h2>
        <p className="text-[#1C365C]/60 text-sm mt-1">Configura tus horas regulares de atención y disponibilidad.</p>
      </div>

      <div className="space-y-4">
        {days.map(({ key, label }) => {
          const dayData = schedule[key];
          return (
            <div key={key} className={`bg-white rounded-[2rem] border transition-colors p-6 ${dayData.enabled ? 'border-[#5A9BD4]/20 shadow-sm' : 'border-[#1C365C]/5 opacity-60'}`}>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                <div className="w-40 flex items-center gap-4 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={dayData.enabled} onChange={(e) => updateScheduleDay(key, { ...dayData, enabled: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
                  </label>
                  <span className={`font-bold ${dayData.enabled ? 'text-[#1C365C]' : 'text-[#1C365C]/50'}`}>{label}</span>
                </div>

                <div className="flex-1 w-full space-y-3">
                  {dayData.enabled ? (
                    <>
                      {dayData.timeRanges.length > 0 ? dayData.timeRanges.map((range, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 bg-[#FDF9F3] p-2 rounded-xl border border-[#1C365C]/5">
                            <Clock className="w-4 h-4 text-[#1C365C]/40" />
                            <input type="time" value={range.start} onChange={() => {}} className="bg-transparent border-none text-sm font-bold text-[#1C365C] focus:ring-0 p-0" />
                            <span className="text-[#1C365C]/30 font-bold">-</span>
                            <input type="time" value={range.end} onChange={() => {}} className="bg-transparent border-none text-sm font-bold text-[#1C365C] focus:ring-0 p-0" />
                          </div>
                          <button className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )) : (
                        <p className="text-sm text-[#1C365C]/40 font-medium py-2">Sin horarios definidos</p>
                      )}
                      <button className="flex items-center gap-1.5 text-[#5A9BD4] text-xs font-bold hover:bg-[#5A9BD4]/10 px-3 py-1.5 rounded-lg transition-colors w-max">
                        <Plus className="w-3 h-3" /> Añadir bloque
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-[#1C365C]/40 font-medium py-2">No disponible</p>
                  )}
                </div>

                {dayData.enabled && (
                  <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-[#1C365C]/10 rounded-xl text-xs font-bold text-[#1C365C]/60 hover:bg-[#FDF9F3] transition-colors shrink-0">
                    <Copy className="w-3 h-3" /> Copiar a todos
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={saveSchedule} disabled={isSaving} className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-8 h-12 rounded-xl font-bold shadow-md">
          {isSaving ? 'Guardando...' : 'Guardar Horario'}
        </Button>
      </div>

      <SaveToast visible={saveSuccess} />
    </div>
  );
};