import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { doctorLocationService, getLocationErrorMessage } from '../../../services/DoctorLocationService';
import type { DoctorLocationDTO } from '../../../services/DoctorLocationService';
import { LocationPickerMap } from './LocationPickerMap';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const DoctorLocationsSection: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.profileId;

  const [locations, setLocations] = useState<DoctorLocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State for Create/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<DoctorLocationDTO | null>(null);
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formType, setFormType] = useState('PRESENCIAL');
  const [formLat, setFormLat] = useState<number | null>(null);
  const [formLng, setFormLng] = useState<number | null>(null);
  const [formIsMain, setFormIsMain] = useState(false);

  const fetchLocations = async () => {
    if (!doctorId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await doctorLocationService.getDoctorLocations(doctorId);
      setLocations(data || []);
    } catch (err: any) {
      console.error('Error fetching locations:', err);
      setError(getLocationErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [doctorId]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingLoc(null);
    setFormName('');
    setFormAddress('');
    setFormCity('');
    setFormType('PRESENCIAL');
    setFormLat(12.115); // Managua center defaults
    setFormLng(-86.236);
    setFormIsMain(false);
    setIsFormOpen(true);
    setError(null);
  };

  const handleOpenEdit = (loc: DoctorLocationDTO) => {
    setEditingLoc(loc);
    setFormName(loc.name);
    setFormAddress(loc.address || '');
    setFormCity(loc.city || '');
    setFormType(loc.type);
    setFormLat(loc.latitude);
    setFormLng(loc.longitude);
    setFormIsMain(loc.isMain);
    setIsFormOpen(true);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;

    if (!formName.trim()) {
      setError('El nombre del lugar es requerido.');
      return;
    }

    if (formLat === null || formLng === null) {
      setError('Por favor selecciona una ubicación en el mapa.');
      return;
    }

    setIsProcessing('save');
    setError(null);

    try {
      if (editingLoc) {
        // Edit Mode
        await doctorLocationService.updateDoctorLocation(editingLoc.id, {
          doctorId,
          name: formName.trim(),
          address: formAddress.trim(),
          city: formCity.trim(),
          latitude: formLat,
          longitude: formLng,
          type: formType,
          isMain: formIsMain,
          active: true,
        });
        showSuccess('Lugar de atención guardado.');
      } else {
        // Create Mode
        await doctorLocationService.createDoctorLocation({
          doctorId,
          name: formName.trim(),
          address: formAddress.trim(),
          city: formCity.trim(),
          latitude: formLat,
          longitude: formLng,
          type: formType,
          isMain: formIsMain,
        });
        showSuccess('Lugar de atención guardado.');
      }
      setIsFormOpen(false);
      await fetchLocations();
    } catch (err: any) {
      console.error('Error saving location:', err);
      setError(getLocationErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!doctorId) return;
    if (!window.confirm('¿Estás seguro de que deseas desactivar este lugar de atención?')) return;

    setIsProcessing(`delete-${id}`);
    setError(null);

    try {
      await doctorLocationService.deleteDoctorLocation(id, doctorId);
      showSuccess('Lugar desactivado.');
      await fetchLocations();
    } catch (err: any) {
      console.error('Error deleting location:', err);
      setError(getLocationErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSetMain = async (id: string) => {
    if (!doctorId) return;
    setIsProcessing(`main-${id}`);
    setError(null);

    try {
      await doctorLocationService.setMainDoctorLocation(id, doctorId);
      showSuccess('Lugar principal actualizado.');
      await fetchLocations();
    } catch (err: any) {
      console.error('Error setting main location:', err);
      setError(getLocationErrorMessage(err));
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#1C365C]/5">
        <div>
          <h3 className="text-xl font-bold text-[#1C365C]">Lugares de Atención</h3>
          <p className="text-sm font-medium text-[#1C365C]/60 mt-1">Configurá las clínicas, consultorios o consultorios virtuales donde atendés.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          disabled={isFormOpen} 
          className="bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4]/20 px-4 h-10 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Añadir
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#A3C9A8]/10 border border-[#A3C9A8]/20 text-[#A3C9A8] text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Locations Editor Form */}
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
              {editingLoc ? 'Editar Lugar de Atención' : 'Nuevo Lugar de Atención'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Nombre del consultorio / clínica</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)} 
                  placeholder="Ej: Consultorio Principal"
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Tipo de Consulta</label>
                <select
                  value={formType}
                  onChange={e => setFormType(e.target.value)}
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2 px-3 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="ONLINE">En línea (Videoconsulta)</option>
                  <option value="DOMICILIO">Visita a Domicilio</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Dirección</label>
                <input 
                  type="text" 
                  value={formAddress} 
                  onChange={e => setFormAddress(e.target.value)} 
                  placeholder="Ej: Bolonia, de la rotonda 2c abajo"
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2 px-3 text-sm font-semibold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Ciudad</label>
                <input 
                  type="text" 
                  value={formCity} 
                  onChange={e => setFormCity(e.target.value)} 
                  placeholder="Ej: Managua"
                  className="w-full bg-white border border-[#1C365C]/10 rounded-xl py-2 px-3 text-sm font-semibold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Latitud</label>
                <input 
                  type="number" 
                  step="any"
                  value={formLat || ''} 
                  onChange={e => setFormLat(e.target.value ? parseFloat(e.target.value) : null)} 
                  className="w-full bg-slate-50 border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-mono text-[#1C365C]/75 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Longitud</label>
                <input 
                  type="number" 
                  step="any"
                  value={formLng || ''} 
                  onChange={e => setFormLng(e.target.value ? parseFloat(e.target.value) : null)} 
                  className="w-full bg-slate-50 border border-[#1C365C]/5 rounded-xl py-2 px-3 text-sm font-mono text-[#1C365C]/75 outline-none"
                  required
                />
              </div>
            </div>

            {/* Map Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Ubicar en el Mapa</label>
              <LocationPickerMap 
                latitude={formLat}
                longitude={formLng}
                onChange={(lat, lng) => {
                  setFormLat(lat);
                  setFormLng(lng);
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formIsMain} 
                  onChange={e => setFormIsMain(e.target.checked)}
                  className="rounded border-[#1C365C]/20 text-[#5A9BD4] focus:ring-[#5A9BD4]/20 w-4 h-4"
                />
                <span className="text-xs font-bold text-[#1C365C]/70">Marcar como consultorio principal</span>
              </label>
              
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

      {isLoading ? (
        <div className="flex justify-center items-center py-10 text-[#5A9BD4]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : locations.length === 0 && !isFormOpen ? (
        <div className="text-center py-10 bg-[#FDF9F3]/30 rounded-2xl border border-dashed border-[#1C365C]/10">
          <MapPin className="w-8 h-8 text-[#1C365C]/20 mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1C365C]/40 uppercase tracking-widest">Aún no agregaste lugares de atención.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {locations.map((loc) => (
              <motion.div 
                key={loc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-2xl border flex flex-col justify-between hover:border-[#1C365C]/10 transition-all ${loc.isMain ? 'bg-[#5A9BD4]/5 border-[#5A9BD4]/35' : 'bg-[#FDF9F3]/30 border-[#1C365C]/5'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1C365C] text-base leading-tight">{loc.name}</h4>
                    {loc.isMain && (
                      <span className="bg-[#5A9BD4] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1C365C]/60 font-semibold mb-1">
                    Tipo: <span className="font-black text-[#5A9BD4]">{loc.type}</span>
                  </p>
                  {loc.address && <p className="text-xs text-[#1C365C]/70 mb-0.5 leading-relaxed">{loc.address}</p>}
                  {loc.city && <p className="text-xs text-[#1C365C]/40 font-bold">{loc.city}</p>}
                  <p className="text-[9px] font-mono text-[#1C365C]/40 mt-3">
                    Coordenadas: {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
                  </p>
                </div>

                <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-[#1C365C]/5">
                  {!loc.isMain && (
                    <button 
                      onClick={() => handleSetMain(loc.id)}
                      disabled={isProcessing !== null}
                      className="text-xs font-bold text-[#5A9BD4] hover:underline disabled:opacity-50"
                    >
                      {isProcessing === `main-${loc.id}` ? 'Cambiando...' : 'Hacer Principal'}
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenEdit(loc)}
                    disabled={isProcessing !== null}
                    className="p-1.5 text-[#1C365C]/40 hover:text-[#5A9BD4] rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(loc.id)}
                    disabled={isProcessing !== null}
                    className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isProcessing === `delete-${loc.id}` ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
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
