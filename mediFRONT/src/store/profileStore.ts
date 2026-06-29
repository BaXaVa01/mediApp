import { create } from 'zustand';
import type { DoctorPublicProfile, DoctorIdentity, DoctorContact, EducationDoctor, ExperienceDoctor } from '../types/profile';
import { profileService } from '../services/profileService';

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
    set({ isLoading: true, error: null });
    try {
      const data = await profileService.getProfile();
      set({ profile: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateIdentity: async (data) => {
    set({ isSaving: true, saveSuccess: false, error: null });
    try {
      const updated = await profileService.updateIdentity(data);
      const current = get().profile!;
      set({ profile: { ...current, identity: updated }, isSaving: false, saveSuccess: true });
      setTimeout(() => set({ saveSuccess: false }), 2000);
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  updateContact: async (data) => {
    set({ isSaving: true, saveSuccess: false, error: null });
    try {
      const updated = await profileService.updateContact(data);
      const current = get().profile!;
      set({ profile: { ...current, contact: updated }, isSaving: false, saveSuccess: true });
      setTimeout(() => set({ saveSuccess: false }), 2000);
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  uploadPhoto: async (file) => {
    set({ isSaving: true, error: null });
    try {
      const url = await profileService.uploadPhoto(file);
      const current = get().profile!;
      set({ profile: { ...current, identity: { ...current.identity, photoUrl: url } }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  removePhoto: async () => {
    set({ isSaving: true, error: null });
    try {
      await profileService.removePhoto();
      const current = get().profile!;
      set({ profile: { ...current, identity: { ...current.identity, photoUrl: '' } }, isSaving: false });
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  addEducation: async (data) => {
    set({ isSaving: true });
    const newEdu = await profileService.addEducation(data);
    const p = get().profile!;
    set({ profile: { ...p, education: [...p.education, newEdu] }, isSaving: false });
  },

  updateEducation: async (id, data) => {
    set({ isSaving: true });
    await profileService.updateEducation(id, data);
    const p = get().profile!;
    set({ profile: { ...p, education: p.education.map(e => e.id === id ? { ...e, ...data } : e) }, isSaving: false });
  },

  deleteEducation: async (id) => {
    set({ isSaving: true });
    await profileService.deleteEducation(id);
    const p = get().profile!;
    set({ profile: { ...p, education: p.education.filter(e => e.id !== id) }, isSaving: false });
  },

  addExperience: async (data) => {
    set({ isSaving: true });
    const newExp = await profileService.addExperience(data);
    const p = get().profile!;
    set({ profile: { ...p, experience: [...p.experience, newExp] }, isSaving: false });
  },

  updateExperience: async (id, data) => {
    set({ isSaving: true });
    await profileService.updateExperience(id, data);
    const p = get().profile!;
    set({ profile: { ...p, experience: p.experience.map(e => e.id === id ? { ...e, ...data } : e) }, isSaving: false });
  },

  deleteExperience: async (id) => {
    set({ isSaving: true });
    await profileService.deleteExperience(id);
    const p = get().profile!;
    set({ profile: { ...p, experience: p.experience.filter(e => e.id !== id) }, isSaving: false });
  }
}));