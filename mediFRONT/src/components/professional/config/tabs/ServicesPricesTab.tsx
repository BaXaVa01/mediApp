import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/AuthContext';
import { doctorServicesService, getServiceErrorMessage } from '../../../../services/DoctorServicesService';
import { doctorLocationService } from '../../../../services/DoctorLocationService';
import type { DoctorServiceResponse } from '../../../../services/DoctorServicesService';
import type { DoctorLocationDTO } from '../../../../services/DoctorLocationService';
import { Stethoscope, Plus, Search, Edit2, Trash2, Clock, MapPin, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ServicesPricesTab: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.profileId;

  // State
  const [services, setServices] = useState<DoctorServiceResponse[]>([]);
  const [locations, setLocations] = useState<DoctorLocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<DoctorServiceResponse | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState(45);
  const [formPrice, setFormPrice] = useState(0);
  const [formLocationId, setFormLocationId] = useState('');
  const [formActive, setFormActive] = useState(true);

  const fetchData = async () => {
    if (!doctorId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [servicesData, locationsData] = await Promise.all([
        doctorServicesService.getDoctorServices(doctorId, false),
        doctorLocationService.getDoctorLocations(doctorId)
      ]);
      setServices(servicesData.services || []);
      setLocations(locationsData || []);
    } catch (err: any) {
      console.error('Error fetching services/locations:', err);
      setError('No pudimos cargar la información de servicios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctorId]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormName('');
    setFormDescription('');
    setFormDuration(45);
    setFormPrice(0);
    setFormLocationId('');
    setFormActive(true);
    setIsFormOpen(true);
    setError(null);
  };

  const handleOpenEdit = (service: DoctorServiceResponse) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDescription(service.description || '');
    setFormDuration(service.durationMinutes);
    setFormPrice(service.price);
    setFormLocationId(service.locationId || '');
    setFormActive(service.active);
    setIsFormOpen(true);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;

    // Validations
    if (!formName.trim() || formName.trim().length < 3 || formName.trim().length > 150) {
      setError('El nombre del servicio debe tener entre 3 y 150 caracteres.');
      return;
    }

    if (formDescription && formDescription.length > 1000) {
      setError('La descripción no puede superar los 1000 caracteres.');
      return;
    }

    if (isNaN(formDuration) || formDuration <= 0) {
      setError('La duración debe ser un número entero mayor a 0.');
      return;
    }

    if (isNaN(formPrice) || formPrice < 0) {
      setError('El precio debe ser un número mayor o igual a 0.');
      return;
    }

    setIsProcessing('save');
    setError(null);

    try {
      if (editingService) {
        // Update
        await doctorServicesService.updateDoctorService(editingService.id, {
          doctorId,
          name: formName.trim(),
          description: formDescription.trim() || null,
          durationMinutes: Math.floor(formDuration),
          price: formPrice,
          locationId: formLocationId || null,
          clinicId: null,
          active: formActive
        });
        showSuccess('Servicio actualizado correctamente.');
      } else {
        // Create
        await doctorServicesService.createDoctorService({
          doctorId,
          name: formName.trim(),
          description: formDescription.trim() || null,
          durationMinutes: Math.floor(formDuration),
          price: formPrice,
          locationId: formLocationId || null,
          clinicId: null
        });
        showSuccess('Servicio creado correctamente.');
      }
      setIsFormOpen(false);
      // Refrescar
      const refreshed = await doctorServicesService.getDoctorServices(doctorId, false);
      setServices(refreshed.services || []);
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(getServiceErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!doctorId) return;
    if (!window.confirm('¿Querés desactivar este servicio? Los pacientes ya no podrán reservarlo.')) return;

    setIsProcessing(`delete-${id}`);
    setError(null);

    try {
      await doctorServicesService.deleteDoctorService(id, doctorId);
      showSuccess('Servicio desactivado correctamente.');
      // Refrescar
      const refreshed = await doctorServicesService.getDoctorServices(doctorId, false);
      setServices(refreshed.services || []);
    } catch (err: any) {
      console.error('Error deleting service:', err);
      setError(getServiceErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1C365C] tracking-tight">Servicios y Precios</h2>
          <p className="text-[#1C365C]/60 text-sm mt-1">Configurá los servicios que ofrecés, su duración y precio para que los pacientes puedan reservar correctamente.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          disabled={isLoading || isFormOpen} 
          className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] px-6 h-12 rounded-xl font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Plus className="w-5 h-5" /> Nuevo Servicio
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#A3C9A8]/10 border border-[#A3C9A8]/20 text-[#A3C9A8] text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Warning if no locations configured */}
      {locations.length === 0 && !isLoading && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Todavía no tenés lugares de atención configurados. Podés crear el servicio ahora, pero para permitir reservas también necesitás configurar lugares.</span>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            className="p-6 bg-[#FDF9F3]/60 rounded-[1.5rem] border border-[#5A9BD4]/30 space-y-5 overflow-hidden"
          >
            <h4 className="font-bold text-base text-[#1C365C]">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Nombre del servicio</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)} 
                  placeholder="Ej: Consulta General"
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2.5 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                  required
                  minLength={3}
                  maxLength={150}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Lugar de Atención</label>
                <select
                  value={formLocationId}
                  onChange={e => setFormLocationId(e.target.value)}
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2.5 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none"
                >
                  <option value="">Sin lugar específico / Asignación flexible</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.city ? `— ${loc.city}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Duración (Minutos)</label>
                <input 
                  type="number" 
                  min={10}
                  max={240}
                  value={formDuration || ''} 
                  onChange={e => setFormDuration(parseInt(e.target.value) || 0)} 
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2.5 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Precio (C$)</label>
                <input 
                  type="number" 
                  min={0}
                  value={formPrice || ''} 
                  onChange={e => setFormPrice(parseFloat(e.target.value) || 0)} 
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2.5 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Descripción (Opcional)</label>
                <textarea 
                  rows={2} 
                  value={formDescription} 
                  onChange={e => setFormDescription(e.target.value)} 
                  maxLength={1000}
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2.5 px-3 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none resize-none custom-scrollbar" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {editingService ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formActive} 
                    onChange={e => setFormActive(e.target.checked)}
                    className="rounded border-[#1C365C]/20 text-[#5A9BD4] focus:ring-[#5A9BD4]/20 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-[#1C365C]/70">Servicio Activo</span>
                </label>
              ) : <div />}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)} 
                  disabled={isProcessing === 'save'} 
                  className="border-[#1C365C]/10 text-[#1C365C] rounded-xl font-bold"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isProcessing === 'save'} 
                  className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] rounded-xl font-bold flex items-center gap-2"
                >
                  {isProcessing === 'save' && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1C365C]/30" />
        <input 
          type="text" 
          placeholder="Buscar servicios..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-[#1C365C]/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12 text-[#5A9BD4]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-[#FDF9F3]/30 rounded-2xl border border-dashed border-[#1C365C]/10 flex flex-col items-center justify-center">
          <Stethoscope className="w-8 h-8 text-[#1C365C]/20 mb-3" />
          <h4 className="text-sm font-bold text-[#1C365C]/50 uppercase tracking-widest mb-1">Aún no has creado servicios.</h4>
          <p className="text-xs text-[#1C365C]/40 font-medium mb-6 max-w-md">Para que los pacientes puedan reservar una cita, agregá al menos un servicio con precio y duración.</p>
          <Button onClick={handleOpenCreate} className="bg-[#5A9BD4] text-white hover:bg-[#4A8BC4] px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm">
            Crear mi primer servicio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredServices.map(service => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[2rem] border border-[#1C365C]/5 shadow-sm hover:shadow-[0_10px_30px_rgba(28,54,92,0.03)] hover:border-[#1C365C]/10 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#FDF9F3] rounded-2xl flex items-center justify-center text-[#5A9BD4] border border-[#1C365C]/5 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenEdit(service)}
                        disabled={isProcessing !== null}
                        className="p-2 text-[#1C365C]/40 hover:text-[#5A9BD4] bg-[#FDF9F3] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)} 
                        disabled={isProcessing !== null} 
                        className="p-2 text-[#1C365C]/40 hover:text-rose-500 bg-[#FDF9F3] rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isProcessing === `delete-${service.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-[#1C365C] mb-2 leading-tight flex items-center gap-2">
                    {service.name}
                    {!service.active && (
                      <span className="bg-rose-50 text-rose-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </h3>
                  {service.description && <p className="text-sm text-[#1C365C]/50 font-medium mb-6 line-clamp-2">{service.description}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-xs bg-[#FDF9F3] px-3 py-1.5 rounded-lg font-bold text-[#1C365C]/70">
                      <Clock className="w-3.5 h-3.5" /> {service.durationMinutes} min
                    </span>
                    {service.locationName && (
                      <span className="flex items-center gap-1.5 text-xs bg-[#FDF9F3] px-3 py-1.5 rounded-lg font-bold text-[#1C365C]/70">
                        <MapPin className="w-3.5 h-3.5 text-[#5A9BD4]" /> {service.locationName}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-between pt-4 border-t border-[#1C365C]/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-[#1C365C]/40 font-bold mb-0.5">Precio</span>
                      <span className="font-black text-2xl text-[#1C365C]">C$ {service.price}</span>
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