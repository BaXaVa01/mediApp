import { useState, useRef } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Camera, Trash2, User, Loader2 } from 'lucide-react';

export const ProfileImageUploader = () => {
  const { profile, uploadPhoto, removePhoto, isSaving } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!profile) return null;
  const photoUrl = profile.identity.photoUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadPhoto(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadPhoto(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-[#1C365C]/5 p-8 shadow-sm flex flex-col sm:flex-row gap-8 items-center sm:items-start">
      <div 
        className={`relative w-32 h-32 shrink-0 rounded-[2rem] overflow-hidden border-2 border-dashed flex items-center justify-center transition-colors ${dragActive ? 'border-[#5A9BD4] bg-[#5A9BD4]/5' : 'border-[#1C365C]/20 bg-[#FDF9F3]'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
      >
        {isSaving ? (
          <Loader2 className="w-8 h-8 text-[#5A9BD4] animate-spin" />
        ) : photoUrl ? (
          <>
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/20 hover:bg-white/40 rounded-lg backdrop-blur-sm transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => removePhoto()} className="p-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg backdrop-blur-sm transition-colors">
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-[#1C365C]/40 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <User className="w-8 h-8 mb-2 group-hover:text-[#5A9BD4] transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-[#5A9BD4] transition-colors">Upload</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-[#1C365C] mb-2">Foto de Perfil</h3>
        <p className="text-sm font-medium text-[#1C365C]/60 mb-6 max-w-sm">
          Añade una foto profesional para que los pacientes te reconozcan. Tamaño recomendado: 500x500px (PNG o JPG).
        </p>
        <div className="flex justify-center sm:justify-start gap-3">
          <button onClick={() => fileInputRef.current?.click()} disabled={isSaving} className="px-5 py-2.5 bg-[#5A9BD4]/10 text-[#5A9BD4] hover:bg-[#5A9BD4]/20 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
            Cambiar Foto
          </button>
          {photoUrl && (
            <button onClick={() => removePhoto()} disabled={isSaving} className="px-5 py-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};