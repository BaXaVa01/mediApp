import { create } from 'zustand';
import type { DoctorPublicProfile, DoctorIdentity, DoctorContact, EducationDoctor, ExperienceDoctor } from '../types/profile';
import { profileService } from '../services/profileService';
import { getAuthUser } from '../auth/authCookies';

interface ProfileState {
  profile: DoctorPublicProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  
  updateIdentity: (data: Partial<DoctorIdentity>) => Promise<void>;
  updateContact: (data: Partial<DoctorContact>) => Promise<void>;
  
  uploadPhoto: (file: File) => Promise<void>;
  removePhoto: () => Promise<void>;

  addEducation: (data: Omit<EducationDoctor, 'id' | 'doctorId'>) => Promise<void>;
  updateEducation: (id: string, data: Partial<EducationDoctor>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;

  addExperience: (data: Omit<ExperienceDoctor, 'id' | 'doctorId'>) => Promise<void>;
  updateExperience: (id: string, data: Partial<ExperienceDoctor>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: true,
  isSaving: false,
  saveSuccess: false,
  error: null,

  fetchProfile: async () => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getProfile(doctorId);
      set({ profile: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'No se pudo cargar el perfil.', isLoading: false });
    }
  },

  updateIdentity: async (data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, saveSuccess: false, error: null });
    try {
      const updated = await profileService.updateIdentity(data, doctorId);
      const current = get().profile!;
      set({ profile: { ...current, identity: updated }, isSaving: false, saveSuccess: true });
      setTimeout(() => set({ saveSuccess: false }), 2000);
    } catch (err: any) {
      set({ error: err.message || 'Error al guardar identidad.', isSaving: false });
      throw err;
    }
  },

  updateContact: async (data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, saveSuccess: false, error: null });
    try {
      const updated = await profileService.updateContact(data, doctorId);
      const current = get().profile!;
      set({ profile: { ...current, contact: updated }, isSaving: false, saveSuccess: true });
      setTimeout(() => set({ saveSuccess: false }), 2000);
    } catch (err: any) {
      set({ error: err.message || 'Error al guardar contacto.', isSaving: false });
      throw err;
    }
  },

  uploadPhoto: async (file) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      const url = await profileService.uploadPhoto(file, doctorId);
      const current = get().profile!;
      set({ profile: { ...current, identity: { ...current.identity, photoUrl: url } }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al subir la foto.', isSaving: false });
      throw err;
    }
  },

  removePhoto: async () => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      await profileService.removePhoto(doctorId);
      const current = get().profile!;
      set({ profile: { ...current, identity: { ...current.identity, photoUrl: '' } }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al eliminar la foto.', isSaving: false });
      throw err;
    }
  },

  addEducation: async (data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      const newEdu = await profileService.addEducation(data, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, education: [...p.education, newEdu] }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al guardar educación.', isSaving: false });
      throw err;
    }
  },

  updateEducation: async (id, data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      await profileService.updateEducation(id, data, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, education: p.education.map(e => e.id === id ? { ...e, ...data } : e) }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar educación.', isSaving: false });
      throw err;
    }
  },

  deleteEducation: async (id) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      await profileService.deleteEducation(id, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, education: p.education.filter(e => e.id !== id) }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al eliminar educación.', isSaving: false });
      throw err;
    }
  },

  addExperience: async (data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      const newExp = await profileService.addExperience(data, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, experience: [...p.experience, newExp] }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al guardar experiencia.', isSaving: false });
      throw err;
    }
  },

  updateExperience: async (id, data) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      await profileService.updateExperience(id, data, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, experience: p.experience.map(e => e.id === id ? { ...e, ...data } : e) }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar experiencia.', isSaving: false });
      throw err;
    }
  },

  deleteExperience: async (id) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isSaving: true, error: null });
    try {
      await profileService.deleteExperience(id, doctorId);
      const p = get().profile!;
      set({ profile: { ...p, experience: p.experience.filter(e => e.id !== id) }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al eliminar experiencia.', isSaving: false });
      throw err;
    }
  }
}));