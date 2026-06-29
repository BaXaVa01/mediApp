import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Info,
  Building,
  Calendar,
  Wallet,
  Building2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import type { Doctor } from '../../types/doctor';
import { agendaService, type BookingDay, type BookingSlot } from '../../services/agendaService';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface AppointmentBookingProps {
  doctor: Doctor;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctor }) => {
  const [modality, setModality] = useState<'Presencial' | 'En línea'>(
    doctor.consultationTypes.includes('En línea') ? 'En línea' : 'Presencial'
  );
  const [selectedAddress, setSelectedAddress] = useState(doctor.careLocations[0]?.address || '');
  const [selectedService, setSelectedService] = useState(doctor.servicesDetails[0]?.name || '');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [schedule, setSchedule] = useState<BookingDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  
  // Confirmation Modal State
  const [confirmingSlot, setConfirmingSlot] = useState<{ day: BookingDay, slot: BookingSlot } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const data = await agendaService.getDoctorBookingSchedule(doctor.id);
      setSchedule(data);
      setLoading(false);
    };
    fetchSchedule();
  }, [doctor.id]);

  const selectedServicePrice = doctor.servicesDetails.find(s => s.name === selectedService)?.price || doctor.price;
  const canOnline = doctor.consultationTypes.includes('En línea');

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      setConfirmingSlot(null);
      setIsConfirmed(false);
    }, 5000);
  };

  return (
    <div id="booking-section" className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(28,54,92,0.08)] border border-[#1C365C]/5 overflow-hidden sticky top-28">
      {/* Header */}
      <div className="bg-[#5A9BD4] p-4 text-center">
        <h3 className="text-white font-bold text-lg">Agendar cita</h3>
      </div>

      {/* Modality Tabs */}
      <div className="flex border-b border-[#1C365C]/5">
        <button 
          onClick={() => setModality('Presencial')}
          className={cn(
            "flex-1 py-4 flex items-center justify-center gap-2 transition-all relative",
            modality === 'Presencial' ? "text-[#5A9BD4] font-bold" : "text-[#1C365C]/40 font-medium"
          )}
        >
          <Building className="w-4 h-4" />
          Visita presencial
          {modality === 'Presencial' && (
            <motion.div 
              layoutId="modalityTab"
              className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5A9BD4]"
            />
          )}
        </button>
        <button 
          disabled={!canOnline}
          onClick={() => setModality('En línea')}
          className={cn(
            "flex-1 py-4 flex items-center justify-center gap-2 transition-all relative",
            !canOnline && "opacity-50 cursor-not-allowed",
            modality === 'En línea' ? "text-[#5A9BD4] font-bold" : "text-[#1C365C]/40 font-medium"
          )}
        >
          <Video className="w-4 h-4" />
          Consulta en línea
          <Info className="w-3 h-3 text-[#1C365C]/30" />
          {modality === 'En línea' && (
            <motion.div 
              layoutId="modalityTab"
              className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5A9BD4]"
            />
          )}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Timeline / Steps */}
        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#5A9BD4]/20">
          
          {/* Address Step - Only for Presencial */}
          {modality === 'Presencial' && (
            <div className="relative">
              <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
                <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
              </div>
              <label className="block text-xs font-bold text-[#1C365C] mb-2">Dirección</label>
              <div className="relative group">
                <select 
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full h-14 pl-4 pr-10 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm font-semibold text-[#1C365C] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all"
                >
                  {doctor.careLocations.map((loc, i) => (
                    <option key={i} value={loc.address}>{loc.address}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C365C]/30 group-focus-within:rotate-180 transition-transform pointer-events-none" />
              </div>
            </div>
          )}

          {/* Service Step */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
              <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
            </div>
            <label className="block text-xs font-bold text-[#1C365C] mb-2">Servicios</label>
            <div className="relative group">
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full h-14 pl-4 pr-10 rounded-xl border border-[#1C365C]/10 bg-[#FDF9F3] text-sm font-semibold text-[#1C365C] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all"
              >
                {doctor.servicesDetails.map((s, i) => (
                  <option key={i} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C365C]/30 group-focus-within:rotate-180 transition-transform pointer-events-none" />
            </div>
          </div>

          {/* Pricing Step */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
              <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#1C365C]/60">{selectedService}</span>
              <span className="font-bold text-[#1C365C]">$ {selectedServicePrice}</span>
            </div>
          </div>

          {/* First Visit Step */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#5A9BD4] flex items-center justify-center z-10">
              <Check className="w-3 h-3 text-[#5A9BD4] stroke-[3]" />
            </div>
            <label className="block text-xs font-bold text-[#1C365C] mb-4">¿Es tu primera visita?</label>
            <div className="flex gap-6">
              {[true, false].map((val) => (
                <label key={val.toString()} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="firstVisit" 
                      className="sr-only" 
                      onChange={() => setIsFirstVisit(val)}
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all",
                      isFirstVisit === val ? "border-[#5A9BD4]" : "border-[#1C365C]/20"
                    )} />
                    {isFirstVisit === val && (
                      <motion.div 
                        layoutId="radioDot"
                        className="absolute w-2.5 h-2.5 rounded-full bg-[#5A9BD4]" 
                      />
                    )}
                  </div>
                  <span className={cn("text-sm font-bold", isFirstVisit === val ? "text-[#1C365C]" : "text-[#1C365C]/40")}>
                    {val ? 'Si' : 'No'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="pt-4 border-t border-[#1C365C]/5">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 rounded-full bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4] hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-1 justify-around px-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2 text-center">
                    <div className="h-3 w-8 bg-[#1C365C]/5 rounded mx-auto" />
                    <div className="h-3 w-10 bg-[#1C365C]/5 rounded mx-auto" />
                  </div>
                ))
              ) : (
                schedule.map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs font-bold text-[#1C365C] mb-1">{day.dayName}</p>
                    <p className="text-[10px] text-[#1C365C]/40 uppercase font-black">{day.dayNumber} {day.monthName}</p>
                  </div>
                ))
              )}
            </div>
            <button className="p-2 rounded-full bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4] hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {!loading && schedule.map((day, i) => (
              <div key={i} className="space-y-3">
                {day.slots.slice(0, showMoreSlots ? undefined : 4).map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setConfirmingSlot({ day, slot })}
                    className={cn(
                      "w-full py-3 rounded-2xl text-xs font-black transition-all",
                      slot.available 
                        ? "bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4] hover:text-white" 
                        : "text-[#1C365C]/20 line-through cursor-not-allowed"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowMoreSlots(!showMoreSlots)}
            className="w-full py-6 mt-4 flex items-center justify-center gap-2 text-[#5A9BD4] font-bold text-sm hover:bg-[#5A9BD4]/5 rounded-2xl transition-all group"
          >
            {showMoreSlots ? 'Mostrar menos horas' : 'Mostrar más horas'}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showMoreSlots && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmingSlot && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isConfirmed && setConfirmingSlot(null)}
              className="absolute inset-0 bg-[#1C365C]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                {!isConfirmed ? (
                  <>
                    <h2 className="text-3xl font-bold text-[#1C365C] mb-8 tracking-tight text-center">Confirmar Cita</h2>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-3 bg-[#5A9BD4]/10 rounded-2xl">
                          <Calendar className="w-6 h-6 text-[#5A9BD4]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-1">Fecha y Hora</p>
                          <p className="font-bold text-[#1C365C]">{confirmingSlot.day.dayName} {confirmingSlot.day.dayNumber} {confirmingSlot.day.monthName} · {confirmingSlot.slot.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-3 bg-[#5A9BD4]/10 rounded-2xl">
                          <Stethoscope className="w-6 h-6 text-[#5A9BD4]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-1">Servicio</p>
                          <p className="font-bold text-[#1C365C]">{selectedService}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-3 bg-[#5A9BD4]/10 rounded-2xl">
                          {modality === 'Presencial' ? <Building2 className="w-6 h-6 text-[#5A9BD4]" /> : <Video className="w-6 h-6 text-[#5A9BD4]" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-1">Modalidad</p>
                          <p className="font-bold text-[#1C365C]">{modality} {modality === 'Presencial' && `· ${selectedAddress}`}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-[#FDF9F3] border border-[#1C365C]/5">
                        <div className="p-3 bg-[#5A9BD4]/10 rounded-2xl">
                          <Wallet className="w-6 h-6 text-[#5A9BD4]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#1C365C]/30 uppercase tracking-widest mb-1">Precio Total</p>
                          <p className="font-bold text-[#1C365C]">$ {selectedServicePrice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => setConfirmingSlot(null)}
                        className="flex-1 h-16 rounded-[1.5rem] font-bold text-[#1C365C]/60"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirm}
                        className="flex-[1.5] h-16 bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] rounded-[1.5rem] font-bold shadow-lg shadow-[#5A9BD4]/20"
                      >
                        Confirmar Cita
                      </Button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-24 h-24 bg-[#5A9BD4]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                      <Check className="w-12 h-12 text-[#5A9BD4] stroke-[3]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1C365C] mb-4 tracking-tight">¡Solicitud Enviada!</h2>
                    <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-[#5A9BD4]/5 text-left mb-8">
                      <AlertCircle className="w-6 h-6 text-[#5A9BD4] shrink-0" />
                      <p className="text-sm font-medium text-[#1C365C]/70 leading-relaxed">
                        Tu solicitud ha sido enviada al <span className="text-[#1C365C] font-bold">{doctor.name}</span>. Te avisaremos vía <span className="text-[#25D366] font-bold">WhatsApp</span> en cuanto el doctor confirme la disponibilidad final.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setConfirmingSlot(null)}
                      className="w-full h-16 bg-[#1C365C] text-white rounded-[1.5rem] font-bold"
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
