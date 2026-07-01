import { useState, useEffect } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { useAuth } from '../../../auth/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { SpecialtyCombobox } from './SpecialtyCombobox';
import { profileService } from '../../../services/profileService';
import type { SpecialtyOption } from '../../../types/profile';

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export const ProfileIdentityForm = () => {
  const { user } = useAuth();
  const doctorId = user?.profileId;
  const { profile, updateIdentity, fetchProfile, isSaving } = useProfileStore();
  const [formData, setFormData] = useState(profile?.identity);

  // Catalog State
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Load Catalog on mount
  useEffect(() => {
    const loadCatalog = async () => {
      setLoadingCatalog(true);
      setCatalogError(null);
      try {
        const catalog = await profileService.getSpecialtiesCatalog();
        setSpecialties(catalog || []);
      } catch (err: any) {
        console.error('Error fetching specialties catalog:', err);
        setCatalogError('No pudimos cargar las especialidades.');
      } finally {
        setLoadingCatalog(false);
      }
    };
    loadCatalog();
  }, []);

  useEffect(() => {
    if (profile) setFormData(profile.identity);
  }, [profile]);

  if (!formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 5 Validation
    if (formData.mainSpecialtyId && !isUuid(formData.mainSpecialtyId)) {
      alert("La especialidad seleccionada no es válida. Seleccioná una opción del catálogo.");
      return;
    }

    // Step 5: console.debug payload log
    console.debug("[ProfileIdentity] payload", {
      doctorId,
      publicName: formData.professionalName,
      mainSpecialtyId: formData.mainSpecialtyId || null,
      headline: formData.headline,
      bio: formData.biography,
      yearsOfExperience: formData.yearsOfExperience
    });

    try {
      await updateIdentity(formData);
      // Step 7: Refrescar desde backend
      await fetchProfile();
    } catch (err: any) {
      console.error("Error updating professional identity:", err);
      // Map common errors
      const code = err?.code || err?.response?.data?.error;
      if (code === "INVALID_SPECIALTY") {
        alert("La especialidad seleccionada no es válida. Seleccioná otra opción.");
      } else if (code === "VALIDATION_ERROR") {
        alert("Revisá los datos de identidad profesional.");
      } else if (err?.status === 401) {
        alert("Tu sesión expiró. Iniciá sesión nuevamente.");
      } else if (err?.status === 403) {
        alert("No tenés permisos para editar este perfil.");
      } else {
        alert("No pudimos guardar tu identidad profesional. Intentá nuevamente.");
      }
    }
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
            required
            minLength={2}
          />
        </div>
        
        {/* Step 3: Replace readonly input with searchable combobox */}
        <div className="space-y-2">
          <SpecialtyCombobox 
            specialties={specialties}
            selectedSpecialtyId={formData.mainSpecialtyId}
            selectedSpecialtyName={formData.mainSpecialty}
            loading={loadingCatalog}
            error={catalogError}
            onSelect={(spec) => {
              // Step 4: setForm updates
              setFormData({
                ...formData,
                mainSpecialtyId: spec.id,
                mainSpecialty: spec.name
              });
            }}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Headline (Título corto)</label>
          <input 
            type="text" 
            value={formData.headline} 
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="Ej: Especialista en insuficiencia cardíaca y prevención"
            maxLength={160}
            className="w-full bg-[#FDF9F3] border border-[#1C365C]/5 rounded-xl py-3 px-4 text-sm font-medium text-[#1C365C] focus:ring-2 focus:ring-[#5A9BD4]/20 transition-all" 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-[#1C365C]/40 uppercase tracking-widest">Biografía</label>
          <textarea 
            rows={4}
            value={formData.biography} 
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            maxLength={3000}
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
            min={0}
            max={80}
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