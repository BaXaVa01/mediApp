import { useState, useEffect } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';

export const ProfileContactForm = () => {
  const { profile, updateContact, isSaving } = useProfileStore();
  const [formData, setFormData] = useState(profile?.contact);

  useEffect(() => {
    if (profile) setFormData(profile.contact);
  }, [profile]);

  if (!formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateContact(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm">
      <div className="mb-8 pb-6 border-b border-[#1C365C]/5">
        <h3 className="text-xl font-bold text-[#1C365C]">Contacto y Visibilidad</h3>
        <p className="text-sm font-medium text-[#1C365C]/60 mt-1">Cómo te encontrarán y contactarán los pacientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Teléfono Público</label>
          <input 
            type="text" 
            value={formData.publicPhone} 
            onChange={(e) => setFormData({ ...formData, publicPhone: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Email Público</label>
          <input 
            type="email" 
            value={formData.publicEmail} 
            onChange={(e) => setFormData({ ...formData, publicEmail: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Ciudad</label>
          <input 
            type="text" 
            value={formData.city} 
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Resumen de Ubicación</label>
          <input 
            type="text" 
            value={formData.addressSummary} 
            onChange={(e) => setFormData({ ...formData, addressSummary: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>

        <div className="md:col-span-2 space-y-4 mt-4 p-5 bg-[#FDF9F3] rounded-2xl border border-[#1C365C]/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1C365C] text-sm">Perfil Público Visible</p>
              <p className="text-xs text-[#1C365C]/50 font-medium">Aparecer en los resultados de búsqueda de pacientes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.profileVisible} onChange={(e) => setFormData({ ...formData, profileVisible: e.target.checked })} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
            </label>
          </div>
          <div className="w-full h-px bg-[#1C365C]/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1C365C] text-sm">Videoconsulta Disponible</p>
              <p className="text-xs text-[#1C365C]/50 font-medium">Mostrar badge de atención en línea en el perfil.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.onlineConsultation} onChange={(e) => setFormData({ ...formData, onlineConsultation: e.target.checked })} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A9BD4]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-[#1C365C]/5">
        <Button type="submit" disabled={isSaving} className="bg-[#1C365C] text-white hover:bg-[#2C466C] px-8 h-12 rounded-xl font-bold shadow-md flex items-center gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};