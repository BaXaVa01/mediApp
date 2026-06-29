import { useEffect } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { LoadingState, SaveToast } from '../../components/professional/config/SystemStates';
import { ProfileImageUploader } from '../../components/professional/profile/ProfileImageUploader';
import { ProfileIdentityForm } from '../../components/professional/profile/ProfileIdentityForm';
import { ProfileContactForm } from '../../components/professional/profile/ProfileContactForm';
import { EducationSection } from '../../components/professional/profile/EducationSection';
import { ExperienceSection } from '../../components/professional/profile/ExperienceSection';
import { ExternalLink } from 'lucide-react';

export default function PublicProfilePage() {
  const { fetchProfile, isLoading, saveSuccess } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="h-[100vh] flex bg-[#FDF9F3] overflow-hidden">
      <div className="flex-1 bg-white overflow-y-auto p-8 lg:p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#1C365C] tracking-tight">Perfil Público</h2>
              <p className="text-[#1C365C]/60 text-sm mt-1">Gestiona la información que los pacientes ven al buscarte.</p>
            </div>
            <button className="flex items-center gap-2 bg-[#FDF9F3] border border-[#1C365C]/5 text-[#1C365C] px-5 h-10 rounded-xl font-bold text-sm hover:bg-[#5A9BD4]/10 hover:text-[#5A9BD4] hover:border-[#5A9BD4]/20 transition-all shadow-sm">
              <ExternalLink className="w-4 h-4" /> Ver Perfil
            </button>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8 pb-12">
              <ProfileImageUploader />
              <ProfileIdentityForm />
              <ProfileContactForm />
              
              <div className="grid grid-cols-1 gap-8">
                <EducationSection />
                <ExperienceSection />
              </div>
            </div>
          )}
        </div>
      </div>
      <SaveToast visible={saveSuccess} />
    </div>
  );
}
