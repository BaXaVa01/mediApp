import { useState, useEffect } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';

export const ProfileIdentityForm = () => {
  const { profile, updateIdentity, isSaving } = useProfileStore();
  const [formData, setFormData] = useState(profile?.identity);

  useEffect(() => {
    if (profile) setFormData(profile.identity);
  }, [profile]);

  if (!formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateIdentity(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#1C365C]/5">
        <div>
          <h3 className="text-xl font-bold text-[#1C365C]">Identidad Profesional</h3>
          <p className="text-sm font-medium text-[#1C365C]/60 mt-1">La información principal que verán tus pacientes.</p>
        </div>
        {formData.verified && (
          <div className="flex items-center gap-1.5 bg-[#A3C9A8]/10 px-3 py-1.5 rounded-full border border-[#A3C9A8]/20">
            <ShieldCheck className="h-4 w-4 text-[#A3C9A8]" />
            <span className="text-[10px] font-bold text-[#1C365C] uppercase tracking-wider">Verificado</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Nombre Público</label>
          <input 
            type="text" 
            value={formData.professionalName} 
            onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Especialidad Principal</label>
          <input 
            type="text" 
            value={formData.mainSpecialty} 
            onChange={(e) => setFormData({ ...formData, mainSpecialty: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Headline (Título corto)</label>
          <input 
            type="text" 
            value={formData.headline} 
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="Ej: Especialista en insuficiencia cardíaca y prevención"
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Biografía</label>
          <textarea 
            rows={4}
            value={formData.biography} 
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] leading-relaxed focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all resize-none custom-scrollbar" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest flex items-center justify-between">
            <span>Cédula Profesional</span>
            <span className="text-rose-400">Solo lectura</span>
          </label>
          <input 
            type="text" 
            value={formData.licenseNumber} 
            disabled
            className="w-full bg-slate-50 border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-mono text-[#1C365C]/50 opacity-70 cursor-not-allowed" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Años de Experiencia</label>
          <input 
            type="number" 
            value={formData.yearsOfExperience} 
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-bold text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
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