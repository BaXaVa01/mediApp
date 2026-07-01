import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../auth/AuthContext';
import { doctorScheduleService, getScheduleErrorMessage } from '../../../../services/DoctorScheduleService';
import type { DoctorLocation } from '../../../../services/DoctorScheduleService';
import { SaveToast } from '../SystemStates';
import { Clock, Plus, Trash2, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '../../../ui/Button';

type EditableScheduleDay = {
  dayOfWeek: number;
  dayName: string;
  enabled: boolean;
  blocks: EditableScheduleBlock[];
};

type EditableScheduleBlock = {
  clientId: string;
  id?: string;
  locationId: string;
  locationName?: string;
  startTime: string;
  endTime: string;
  appointmentDurationMinutes: number;
};

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const WeeklyScheduleTab: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = user?.profileId;

  const [scheduleDays, setScheduleDays] = useState<EditableScheduleDay[]>([]);
  const [locations, setLocations] = useState<DoctorLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [scheduleRes, locationsRes] = await Promise.all([
          doctorScheduleService.getDoctorSchedule(doctorId),
          doctorScheduleService.getDoctorLocations(doctorId)
        ]);

        const activeLocations = (locationsRes || []).filter(loc => loc.active);
        setLocations(activeLocations);

        // Initialize 7 days
        const initialDays: EditableScheduleDay[] = Array.from({ length: 7 }, (_, i) => ({
          dayOfWeek: i + 1,
          dayName: dayNames[i],
          enabled: false,
          blocks: []
        }));

        if (scheduleRes?.schedule) {
          scheduleRes.schedule.forEach(day => {
            const index = day.dayOfWeek - 1;
            if (index >= 0 && index < 7) {
              initialDays[index] = {
                dayOfWeek: day.dayOfWeek,
                dayName: dayNames[index],
                enabled: day.blocks && day.blocks.length > 0,
                blocks: (day.blocks || []).map(b => ({
                  clientId: `${Date.now()}_${Math.random()}`,
                  id: b.id,
                  locationId: b.locationId,
                  locationName: b.locationName,
                  startTime: b.startTime,
                  endTime: b.endTime,
                  appointmentDurationMinutes: b.appointmentDurationMinutes
                }))
              };
            }
          });
        }

        setScheduleDays(initialDays);
      } catch (err: any) {
        console.error('Error loading doctor schedule/locations:', err);
        setError(getScheduleErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [doctorId]);

  // Day toggle handler
  const handleToggleDay = (dayOfWeek: number, checked: boolean) => {
    setScheduleDays(prev => prev.map(d => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      
      let blocks = [...d.blocks];
      if (checked && blocks.length === 0 && locations.length > 0) {
        // Automatically add default block if toggling on and has locations
        blocks = [{
          clientId: `${Date.now()}_${Math.random()}`,
          locationId: locations[0].id,
          startTime: "09:00",
          endTime: "12:00",
          appointmentDurationMinutes: 30
        }];
      }
      
      return { ...d, enabled: checked, blocks };
    }));
  };

  // Block addition handler
  const handleAddBlock = (dayOfWeek: number) => {
    if (locations.length === 0) return;
    
    setScheduleDays(prev => prev.map(d => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      
      const newBlock: EditableScheduleBlock = {
        clientId: `${Date.now()}_${Math.random()}`,
        locationId: locations[0].id,
        startTime: "09:00",
        endTime: "12:00",
        appointmentDurationMinutes: 30
      };
      
      return { ...d, blocks: [...d.blocks, newBlock] };
    }));
  };

  // Block removal handler
  const handleRemoveBlock = (dayOfWeek: number, clientId: string) => {
    setScheduleDays(prev => prev.map(d => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      return { ...d, blocks: d.blocks.filter(b => b.clientId !== clientId) };
    }));
  };

  // Block property update handler
  const handleUpdateBlock = (dayOfWeek: number, clientId: string, patch: Partial<EditableScheduleBlock>) => {
    setScheduleDays(prev => prev.map(d => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      return {
        ...d,
        blocks: d.blocks.map(b => b.clientId === clientId ? { ...b, ...patch } : b)
      };
    }));
  };

  // Client validation
  const validateSchedule = (days: EditableScheduleDay[]): string | null => {
    for (const day of days) {
      if (!day.enabled) continue;

      if (day.blocks.length === 0) {
        return `El día ${day.dayName} está activo pero no tiene ningún bloque de horario. Agregá al menos un bloque o desactivá el día.`;
      }

      for (let i = 0; i < day.blocks.length; i++) {
        const b = day.blocks[i];
        const blockNum = i + 1;
        const prefix = `${day.dayName} (Bloque ${blockNum}):`;

        if (!b.locationId) {
          return `${prefix} Debe seleccionar un lugar de atención.`;
        }

        if (!b.startTime || !b.endTime) {
          return `${prefix} Las horas de inicio y fin son obligatorias.`;
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(b.startTime) || !timeRegex.test(b.endTime)) {
          return `${prefix} El formato de hora debe ser HH:mm.`;
        }

        const [startH, startM] = b.startTime.split(':').map(Number);
        const [endH, endM] = b.endTime.split(':').map(Number);
        const startMins = startH * 60 + startM;
        const endMins = endH * 60 + endM;

        if (startMins >= endMins) {
          return `${prefix} La hora de inicio (${b.startTime}) debe ser anterior a la de fin (${b.endTime}).`;
        }

        if (b.appointmentDurationMinutes <= 0) {
          return `${prefix} La duración de la cita debe ser mayor a 0 minutos.`;
        }

        if (b.appointmentDurationMinutes < 10 || b.appointmentDurationMinutes > 240) {
          return `${prefix} La duración de la cita debe estar entre 10 y 240 minutos.`;
        }

        const totalDuration = endMins - startMins;
        if (b.appointmentDurationMinutes > totalDuration) {
          return `${prefix} La duración de la cita (${b.appointmentDurationMinutes} min) no puede ser mayor que el rango del bloque (${totalDuration} min).`;
        }

        // Overlaps checks
        for (let j = i + 1; j < day.blocks.length; j++) {
          const other = day.blocks[j];
          const [otherStartH, otherStartM] = other.startTime.split(':').map(Number);
          const [otherEndH, otherEndM] = other.endTime.split(':').map(Number);
          const otherStartMins = otherStartH * 60 + otherStartM;
          const otherEndMins = otherEndH * 60 + otherEndM;

          if (startMins < otherEndMins && endMins > otherStartMins) {
            return `Traslape en ${day.dayName}: El bloque ${blockNum} (${b.startTime}-${b.endTime}) se traslapa con el bloque ${j + 1} (${other.startTime}-${other.endTime}).`;
          }
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    if (!doctorId) return;
    setError(null);

    const validationError = validateSchedule(scheduleDays);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      // Map state back to ReplaceDoctorScheduleRequest DTO
      const enabledDaysWithBlocks = scheduleDays
        .filter(d => d.enabled && d.blocks.length > 0)
        .map(d => ({
          dayOfWeek: d.dayOfWeek,
          blocks: d.blocks.map(b => ({
            locationId: b.locationId,
            startTime: b.startTime,
            endTime: b.endTime,
            appointmentDurationMinutes: b.appointmentDurationMinutes
          }))
        }));

      const payload = {
        doctorId,
        schedule: enabledDaysWithBlocks
      };

      const response = await doctorScheduleService.replaceDoctorSchedule(payload);

      // Re-initialize state with updated response to ensure sync
      const updatedDays: EditableScheduleDay[] = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i + 1,
        dayName: dayNames[i],
        enabled: false,
        blocks: []
      }));

      if (response?.schedule) {
        response.schedule.forEach(day => {
          const index = day.dayOfWeek - 1;
          if (index >= 0 && index < 7) {
            updatedDays[index] = {
              dayOfWeek: day.dayOfWeek,
              dayName: dayNames[index],
              enabled: day.blocks && day.blocks.length > 0,
              blocks: (day.blocks || []).map(b => ({
                clientId: `${Date.now()}_${Math.random()}`,
                id: b.id,
                locationId: b.locationId,
                locationName: b.locationName,
                startTime: b.startTime,
                endTime: b.endTime,
                appointmentDurationMinutes: b.appointmentDurationMinutes
              }))
            };
          }
        });
      }

      setScheduleDays(updatedDays);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving schedule:', err);
      setError(getScheduleErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#5A9BD4]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current mb-4" />
        <span className="text-sm font-bold">Cargando horario y configuración...</span>
      </div>
    );
  }

  // Location guard check
  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-[#1C365C]/5 p-12 text-center space-y-6 max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 bg-[#5A9BD4]/10 rounded-2xl flex items-center justify-center mx-auto text-[#5A9BD4]">
          <MapPin className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-[#1C365C]">Falta Lugar de Atención</h3>
          <p className="text-sm text-[#1C365C]/60 leading-relaxed">
            Primero agregá un lugar de atención antes de configurar horarios.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/doctor/profile')}
          className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-6 h-12 rounded-xl font-bold"
        >
          Configurar Lugares de Atención
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Horario Semanal</h2>
        <p className="text-[#1C365C]/60 text-sm mt-1">Configurá tus días y bloques de atención para que los pacientes reserven.</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {scheduleDays.map((day) => {
          return (
            <div 
              key={day.dayOfWeek} 
              className={`bg-white rounded-[2rem] border transition-colors p-6 ${
                day.enabled 
                  ? 'border-[#5A9BD4]/20 shadow-[0_4px_20px_rgba(90,155,212,0.03)]' 
                  : 'border-[#1C365C]/5 opacity-60 bg-[#FDF9F3]/30'
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Day toggle */}
                <div className="w-44 flex items-center gap-4 shrink-0 mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={day.enabled} 
                      onChange={(e) => handleToggleDay(day.dayOfWeek, e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
                  </label>
                  <span className={`font-black text-base ${day.enabled ? 'text-[#1C365C]' : 'text-[#1C365C]/40'}`}>
                    {day.dayName}
                  </span>
                </div>

                {/* Blocks Area */}
                <div className="flex-1 w-full space-y-4">
                  {day.enabled ? (
                    <>
                      {day.blocks.length > 0 ? (
                        <div className="space-y-3">
                          {day.blocks.map((block) => (
                            <div 
                              key={block.clientId} 
                              className="flex flex-wrap items-center gap-3 bg-[#FDF9F3]/40 p-4 rounded-2xl border border-[#1C365C]/5 shadow-sm"
                            >
                              {/* Location Select */}
                              <div className="flex-1 min-w-[200px] space-y-1">
                                <label className="block text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-wider">Lugar de atención</label>
                                <select
                                  value={block.locationId}
                                  onChange={(e) => handleUpdateBlock(day.dayOfWeek, block.clientId, { locationId: e.target.value })}
                                  className="w-full h-11 px-3 rounded-xl border border-[#1C365C]/10 bg-white text-sm font-semibold text-[#1C365C] focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all cursor-pointer"
                                >
                                  {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                      {loc.name} {loc.address ? `— ${loc.address}` : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Time Range */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-wider">Inicio / Fin</label>
                                <div className="flex items-center gap-2 bg-white px-3 h-11 rounded-xl border border-[#1C365C]/10">
                                  <Clock className="w-4 h-4 text-[#1C365C]/40" />
                                  <input 
                                    type="time" 
                                    value={block.startTime} 
                                    onChange={(e) => handleUpdateBlock(day.dayOfWeek, block.clientId, { startTime: e.target.value })} 
                                    className="bg-transparent border-none text-sm font-bold text-[#1C365C] focus:ring-0 p-0 w-12" 
                                  />
                                  <span className="text-[#1C365C]/30 font-bold">-</span>
                                  <input 
                                    type="time" 
                                    value={block.endTime} 
                                    onChange={(e) => handleUpdateBlock(day.dayOfWeek, block.clientId, { endTime: e.target.value })} 
                                    className="bg-transparent border-none text-sm font-bold text-[#1C365C] focus:ring-0 p-0 w-12" 
                                  />
                                </div>
                              </div>

                              {/* Duration Input */}
                              <div className="w-32 space-y-1">
                                <label className="block text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-wider">Cita (min)</label>
                                <input
                                  type="number"
                                  min={10}
                                  max={240}
                                  value={block.appointmentDurationMinutes}
                                  onChange={(e) => handleUpdateBlock(day.dayOfWeek, block.clientId, { appointmentDurationMinutes: parseInt(e.target.value, 10) || 0 })}
                                  className="w-full h-11 px-3 rounded-xl border border-[#1C365C]/10 bg-white text-sm font-semibold text-[#1C365C] focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all"
                                />
                              </div>

                              {/* Delete Block */}
                              <button 
                                onClick={() => handleRemoveBlock(day.dayOfWeek, block.clientId)}
                                className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors shrink-0"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#1C365C]/40 font-medium py-3 bg-[#FDF9F3]/30 rounded-2xl border border-dashed border-[#1C365C]/10 text-center">
                          Sin bloques definidos. Agregá uno para atender este día.
                        </p>
                      )}
                      
                      <button 
                        onClick={() => handleAddBlock(day.dayOfWeek)}
                        className="flex items-center gap-1.5 text-[#5A9BD4] text-xs font-bold hover:bg-[#5A9BD4]/10 px-4 py-2 rounded-xl transition-colors w-max"
                      >
                        <Plus className="w-4 h-4" /> Añadir bloque
                      </button>
                    </>
                  ) : (
                    <div className="py-3 text-sm text-[#1C365C]/40 font-bold">
                      No atiende este día
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-6 border-t border-[#1C365C]/5">
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="bg-[#1C365C] text-white hover:bg-[#12243d] px-8 h-14 rounded-[1.5rem] font-bold shadow-lg shadow-[#1C365C]/10"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Guardando Horarios...
            </>
          ) : (
            'Guardar Horarios'
          )}
        </Button>
      </div>

      <SaveToast visible={saveSuccess} />
    </div>
  );
};