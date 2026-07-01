import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Check, 
  Info,
  Calendar,
  Wallet,
  Building2,
  AlertCircle,
  Stethoscope,
  FileText
} from 'lucide-react';
import type { Doctor } from '../../types/doctor';
import { useAuth } from '../../auth/AuthContext';
import { appointmentService, getAppointmentErrorMessage } from '../../services/AppointmentService';
import type { DoctorService, DoctorLocation, AppointmentSlot } from '../../types/appointmentTypes';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface AppointmentBookingProps {
  doctor: Doctor;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isDoctor } = useAuth();

  // Services & Locations from Backend
  const [services, setServices] = useState<DoctorService[]>([]);
  const [locations, setLocations] = useState<DoctorLocation[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Slot Selection & Modal
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState<any>(null);

  // Load Services and Locations
  useEffect(() => {
    const loadConfig = async () => {
      setLoadingConfig(true);
      setConfigError(null);
      try {
        const [fetchedServices, fetchedLocations] = await Promise.all([
          appointmentService.getDoctorServices(doctor.id),
          appointmentService.getDoctorLocations(doctor.id)
        ]);

        const activeServices = fetchedServices.filter(s => s.active);
        const activeLocations = fetchedLocations.filter(l => l.active);

        setServices(activeServices);
        setLocations(activeLocations);

        if (activeServices.length > 0) {
          setSelectedServiceId(activeServices[0].id);
        }
        if (activeLocations.length > 0) {
          setSelectedLocationId(activeLocations[0].id);
        }
      } catch (err: any) {
        console.error('Error loading booking configuration:', err);
        setConfigError('No se pudo cargar la información del doctor. Intentá de nuevo.');
      } finally {
        setLoadingConfig(false);
      }
    };

    loadConfig();
  }, [doctor.id]);

  // Pre-select Location when Service changes if service specifies locationId
  useEffect(() => {
    if (!selectedServiceId || services.length === 0) return;
    const currentService = services.find(s => s.id === selectedServiceId);
    if (currentService && currentService.locationId) {
      const matchLoc = locations.find(l => l.id === currentService.locationId);
      if (matchLoc) {
        setSelectedLocationId(matchLoc.id);
      }
    }
  }, [selectedServiceId, services, locations]);

  // Load Availability when Date/Service/Location changes
  useEffect(() => {
    if (!selectedServiceId || !selectedLocationId || !selectedDate) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const res = await appointmentService.getAvailability({
          doctorId: doctor.id,
          date: selectedDate,
          serviceId: selectedServiceId,
          locationId: selectedLocationId
        });
        setSlots(res.slots || []);
      } catch (err: any) {
        console.error('Error loading availability slots:', err);
        setSlotsError(getAppointmentErrorMessage(err));
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [doctor.id, selectedDate, selectedServiceId, selectedLocationId]);

  // Get current active selection details
  const activeService = services.find(s => s.id === selectedServiceId);
  const activeLocation = locations.find(l => l.id === selectedLocationId);
  const todayStr = new Date().toISOString().split('T')[0];

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user?.profileId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await appointmentService.createAppointment({
        patientId: user.profileId,
        doctorId: doctor.id,
        serviceId: selectedServiceId,
        locationId: selectedLocationId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        reason: reason.trim(),
        notes: notes.trim()
      });

      setConfirmedDetails(response);
      setIsConfirmed(true);

      // Refresh availability slots to reflect the booked slot
      const refreshRes = await appointmentService.getAvailability({
        doctorId: doctor.id,
        date: selectedDate,
        serviceId: selectedServiceId,
        locationId: selectedLocationId
      });
      setSlots(refreshRes.slots || []);

    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setSubmitError(getAppointmentErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setReason('');
    setNotes('');
    setSubmitError(null);
    setIsConfirmed(false);
    setConfirmedDetails(null);
  };

  // Auth Guard Screen (Not logged in)
  if (!isAuthenticated) {
    return (
      <div id="booking-section" className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(28,54,92,0.08)] border border-[#1C365C]/5 overflow-hidden sticky top-28 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-[#5A9BD4]/10 rounded-2xl flex items-center justify-center mx-auto text-[#5A9BD4]">
          <Info className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#1C365C] mb-2">Iniciá sesión para reservar</h4>
          <p className="text-sm text-[#1C365C]/60 leading-relaxed">
            Necesitás tener una cuenta de paciente para poder reservar turnos y coordinar con el doctor.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/login', { state: { from: location } })}
          className="w-full h-12 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] rounded-xl font-bold"
        >
          Iniciar sesión
        </Button>
      </div>
    );
  }

  // Auth Guard Screen (Doctor logged in)
  if (isDoctor) {
    return (
      <div id="booking-section" className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(28,54,92,0.08)] border border-[#1C365C]/5 overflow-hidden sticky top-28 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#1C365C] mb-2">Perfil de Médico</h4>
          <p className="text-sm text-[#1C365C]/60 leading-relaxed">
            Las cuentas de doctor no pueden reservar citas como paciente.
          </p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div id="booking-section" className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(28,54,92,0.08)] border border-[#1C365C]/5 overflow-hidden sticky top-28">
      {/* Header */}
      <div className="bg-[#5A9BD4] p-4 text-center">
        <h3 className="text-white font-bold text-lg">Agendar cita</h3>
      </div>

      {loadingConfig ? (
        <div className="p-10 flex flex-col items-center justify-center text-[#5A9BD4]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-3" />
          <span className="text-sm font-semibold">Cargando servicios del doctor...</span>
        </div>
      ) : configError ? (
        <div className="p-8 text-center text-red-500 font-medium">
          {configError}
        </div>
      ) : services.length === 0 ? (
        <div className="p-8 text-center text-[#1C365C]/60 font-medium">
          Este doctor aún no tiene servicios disponibles para reservar.
        </div>
      ) : locations.length === 0 ? (
        <div className="p-8 text-center text-[#1C365C]/60 font-medium">
          Este doctor aún no tiene lugares de atención disponibles.
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Steps list */}
          <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#5A9BD4]/20">
            
            {/* Service Step */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
                <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
              </div>
              <label className="block text-xs font-bold text-[#1C365C] mb-2">Servicio</label>
              <div className="relative group">
                <select 
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full h-14 pl-4 pr-10 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm font-semibold text-[#1C365C] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C365C]/30 group-focus-within:rotate-180 transition-transform pointer-events-none" />
              </div>
            </div>

            {/* Location Step */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
                <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
              </div>
              <label className="block text-xs font-bold text-[#1C365C] mb-2">Lugar de atención</label>
              <div className="relative group">
                <select 
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full h-14 pl-4 pr-10 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm font-semibold text-[#1C365C] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.address ? `(${loc.address})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C365C]/30 group-focus-within:rotate-180 transition-transform pointer-events-none" />
              </div>
            </div>

            {/* Price and Duration Summary */}
            {activeService && (
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-[#5A9BD4]/10 border-2 border-[#5A9BD4] flex items-center justify-center z-10">
                  <Wallet className="w-3 h-3 text-[#5A9BD4]" />
                </div>
                <div className="bg-[#FDF9F3]/60 p-4 rounded-2xl border border-[#1C365C]/5 flex justify-between items-center text-sm">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#1C365C]">${activeService.price}</span>
                    <p className="text-xs text-[#1C365C]/50">Duración: {activeService.durationMinutes} min</p>
                  </div>
                  {activeService.description && (
                    <span className="text-xs text-[#1C365C]/60 text-right max-w-[180px] line-clamp-2">
                      {activeService.description}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
                <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
              </div>
              <label className="block text-xs font-bold text-[#1C365C] mb-2">Fecha</label>
              <input 
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm font-semibold text-[#1C365C] focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all cursor-pointer"
              />
            </div>

          </div>

          {/* Time Slots Area */}
          <div className="pt-4 border-t border-[#1C365C]/5">
            <h4 className="text-xs font-bold text-[#1C365C] mb-4">Horarios disponibles</h4>

            {!selectedDate ? (
              <div className="text-center py-6 text-[#1C365C]/40 text-sm font-medium">
                Seleccioná una fecha para ver horarios.
              </div>
            ) : loadingSlots ? (
              <div className="flex flex-col items-center justify-center py-8 text-[#5A9BD4]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mb-2" />
                <span className="text-xs font-semibold">Consultando disponibilidad...</span>
              </div>
            ) : slotsError ? (
              <div className="text-center py-6 text-red-500 text-xs font-semibold">
                {slotsError}
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8 text-[#1C365C]/60 text-sm font-medium bg-[#FDF9F3]/50 rounded-2xl border border-dashed border-[#1C365C]/10">
                No hay horarios disponibles para esta fecha. Probá otro día.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-3.5 rounded-2xl text-xs font-bold transition-all border",
                      slot.available 
                        ? "bg-[#5A9BD4]/5 text-[#5A9BD4] border-[#5A9BD4]/15 hover:bg-[#5A9BD4] hover:text-white hover:border-[#5A9BD4] active:scale-95" 
                        : "bg-gray-50 text-[#1C365C]/20 border-gray-100 line-through cursor-not-allowed"
                    )}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Wizard Modal */}
      <AnimatePresence>
        {selectedSlot && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && !isConfirmed && handleCloseModal()}
              className="absolute inset-0 bg-[#1C365C]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {!isConfirmed ? (
                  <>
                    <h2 className="text-3xl font-bold text-[#1C365C] tracking-tight text-center mb-2">Resumen de Reserva</h2>
                    <p className="text-sm text-[#1C365C]/60 text-center mb-8">Por favor completá los detalles y confirmá tu cita.</p>
                    
                    {submitError && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* DateTime Summary */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-2.5 bg-[#5A9BD4]/10 rounded-xl text-[#5A9BD4]">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-0.5">Fecha y Hora</p>
                          <p className="font-bold text-sm text-[#1C365C]">{selectedDate} · {selectedSlot.startTime} a {selectedSlot.endTime}</p>
                        </div>
                      </div>

                      {/* Service Summary */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-2.5 bg-[#5A9BD4]/10 rounded-xl text-[#5A9BD4]">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-0.5">Servicio y Duración</p>
                          <p className="font-bold text-sm text-[#1C365C]">{activeService?.name} ({activeService?.durationMinutes} min)</p>
                        </div>
                      </div>

                      {/* Location Summary */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-2.5 bg-[#5A9BD4]/10 rounded-xl text-[#5A9BD4]">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-0.5">Lugar de atención</p>
                          <p className="font-bold text-sm text-[#1C365C]">{activeLocation?.name} · {activeLocation?.address}</p>
                        </div>
                      </div>

                      {/* Cost Summary */}
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-2.5 bg-[#5A9BD4]/10 rounded-xl text-[#5A9BD4]">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-0.5">Costo de Consulta</p>
                          <p className="font-bold text-sm text-[#1C365C]">${activeService?.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#1C365C] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#5A9BD4]" />
                          Motivo de la consulta <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Ej: Dolor persistente de cabeza, revisión de laboratorio..."
                          rows={3}
                          maxLength={500}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full p-4 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm text-[#1C365C] placeholder:text-[#1C365C]/30 focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all resize-none"
                          required
                        />
                        <div className="text-right text-[10px] text-[#1C365C]/40">
                          {reason.length}/500 caracteres
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#1C365C] flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#5A9BD4]" />
                          Notas adicionales (Opcional)
                        </label>
                        <textarea
                          placeholder="Cualquier información extra relevante para el especialista..."
                          rows={2}
                          maxLength={1000}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full p-4 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm text-[#1C365C] placeholder:text-[#1C365C]/30 focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all resize-none"
                        />
                        <div className="text-right text-[10px] text-[#1C365C]/40">
                          {notes.length}/1000 caracteres
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-[#1C365C]/5">
                      <Button 
                        variant="outline"
                        onClick={handleCloseModal}
                        disabled={isSubmitting}
                        className="flex-1 h-16 rounded-[1.5rem] font-bold text-[#1C365C]/60"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting || !reason.trim()}
                        className="flex-[1.5] h-16 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] rounded-[1.5rem] font-bold shadow-lg shadow-[#5A9BD4]/20 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Reservando...
                          </>
                        ) : (
                          'Confirmar Cita'
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-20 h-20 bg-[#A3C9A8]/10 rounded-[2rem] flex items-center justify-center mx-auto text-[#A3C9A8]">
                      <Check className="w-10 h-10 stroke-[3]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-[#1C365C] tracking-tight">¡Solicitud Enviada!</h2>
                      <p className="text-sm font-semibold text-[#5A9BD4] uppercase tracking-wider">
                        Estado: {confirmedDetails?.status || 'Pendiente'}
                      </p>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-[#5A9BD4]/5 border border-[#5A9BD4]/10 text-left space-y-3">
                      <div className="flex gap-3 text-[#1C365C]/80 text-sm">
                        <AlertCircle className="w-5 h-5 text-[#5A9BD4] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Tu solicitud de cita fue enviada. El doctor debe aceptarla. Te notificaremos en cuanto se confirme el turno.
                        </p>
                      </div>
                      {confirmedDetails?.appointmentId && (
                        <p className="text-[10px] font-mono text-[#1C365C]/40 text-center pt-2">
                          Código de cita: {confirmedDetails.appointmentId}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleCloseModal}
                      className="w-full h-16 bg-[#1C365C] hover:bg-[#12243d] text-white rounded-[1.5rem] font-bold"
                    >
                      Entendido
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
