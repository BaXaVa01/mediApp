import type { DoctorIdentity, DoctorContact, EducationDoctor, ExperienceDoctor, DoctorPublicProfile, SpecialtyOption } from '../types/profile';
import { apiFetch, API_BASE_URL } from '../lib/api';
import type { Doctor } from '../types/doctor';

export class ProfileService {
  async searchProfessionals(query: string): Promise<Doctor[]> {
    return apiFetch<Doctor[]>(`/api/professionals/search?query=${encodeURIComponent(query)}`);
  }

  async getAllProfessionals(): Promise<Doctor[]> {
    return apiFetch<Doctor[]>(`/api/professionals`);
  }

  async getProfessionalById(doctorId: string): Promise<Doctor> {
    const res = await apiFetch<any>(`/api/professionals/${doctorId}`);
    const photoUrl = res.photo || `${API_BASE_URL}/api/professionals/${doctorId}/photo`;
    
    return {
      id: res.id || doctorId,
      name: res.name || '',
      specialty: res.specialty || '',
      bio: res.bio || '',
      rating: res.rating || 0,
      reviewCount: res.reviewCount || 0,
      price: res.price || 0,
      photo: photoUrl,
      location: {
        lat: res.location?.lat || 0,
        lng: res.location?.lng || 0,
        address: res.location?.address || ''
      },
      locations: (res.locations || []).map((l: any) => ({
        lat: l.lat || 0,
        lng: l.lng || 0,
        address: l.address || ''
      })),
      availability: res.availability || [],
      availabilityPreview: (res.availabilityPreview || []).map((ap: any) => ({
        date: ap.date || '',
        time: ap.time || ''
      })),
      consultationTypes: res.consultationTypes || [],
      insurance: res.insurance || [],
      titles: res.titles || [],
      experience: res.experience || '',
      services: res.services || [],
      licenseNumber: res.licenseNumber || '',
      diseasesTreated: res.diseasesTreated || [],
      patientTypes: res.patientTypes || [],
      education: res.education || [],
      certifications: res.certifications || [],
      languages: res.languages || [],
      publications: res.publications || [],
      awards: res.awards || [],
      servicesDetails: (res.servicesDetails || []).map((sd: any) => ({
        name: sd.name || '',
        price: sd.price || 0,
        duration: sd.duration || ''
      })),
      careLocations: (res.careLocations || []).map((cl: any) => ({
        name: cl.name || '',
        address: cl.address || '',
        phone: cl.phone || '',
        availability: cl.availability || ''
      })),
      gallery: res.gallery || [],
      reviews: (res.reviews || []).map((rv: any) => ({
        patientName: rv.patientName || 'Paciente',
        comment: rv.comment || '',
        rating: rv.rating || 5,
        date: rv.date || ''
      })),
      schedule: (res.schedule || []).map((s: any) => ({
        day: s.day || '',
        hours: s.hours || ''
      })),
      appointments: []
    };
  }

  async getProfile(doctorId: string): Promise<DoctorPublicProfile> {
    const res = await apiFetch<any>(`/api/doctor/profile/settings?doctorId=${encodeURIComponent(doctorId)}`);
    
    const id = res.doctorId || doctorId;
    const photoUrl = res.photoUrl || '';
    const pi = res.professionalIdentity || {};
    const cv = res.contactVisibility || {};
    
    return {
      identity: {
        id,
        userId: id,
        professionalName: pi.publicName || '',
        headline: pi.headline || '',
        biography: pi.bio || '',
        photoUrl: photoUrl,
        licenseNumber: '',
        yearsOfExperience: pi.yearsOfExperience || 0,
        verified: true,
        languagesSpoken: [],
        mainSpecialty: pi.mainSpecialtyName || '',
        mainSpecialtyId: pi.mainSpecialtyId || null,
        additionalSpecialties: []
      },
      contact: {
        id,
        publicPhone: cv.publicPhone || '',
        publicEmail: cv.publicEmail || '',
        city: cv.city || '',
        addressSummary: cv.locationSummary || '',
        onlineConsultation: cv.onlineConsultationAvailable || false,
        profileVisible: cv.profileVisible || false
      },
      education: (res.education || []).map((e: any) => ({
        id: e.id,
        doctorId: id,
        title: e.title || '',
        institution: e.institution || '',
        startYear: e.startYear || new Date().getFullYear(),
        endYear: e.endYear || null,
        description: e.description || ''
      })),
      experience: (res.experience || []).map((ex: any) => ({
        id: ex.id,
        doctorId: id,
        role: ex.position || '',
        institution: ex.institution || '',
        startYear: ex.startYear || new Date().getFullYear(),
        endYear: ex.endYear || null,
        description: ex.description || ''
      }))
    };
  }

  async updateIdentity(data: Partial<DoctorIdentity>, doctorId: string): Promise<DoctorIdentity> {
    const res = await apiFetch<any>('/api/doctor/profile/identity', {
      method: 'PUT',
      body: JSON.stringify({
        doctorId,
        publicName: data.professionalName,
        mainSpecialtyId: (data as any).mainSpecialtyId || null,
        headline: data.headline,
        bio: data.biography,
        yearsOfExperience: data.yearsOfExperience
      })
    });
    
    return {
      id: doctorId,
      userId: doctorId,
      professionalName: res.publicName || '',
      headline: res.headline || '',
      biography: res.bio || '',
      photoUrl: data.photoUrl || '',
      licenseNumber: '',
      yearsOfExperience: res.yearsOfExperience || 0,
      verified: true,
      languagesSpoken: [],
      mainSpecialty: res.mainSpecialtyName || '',
      mainSpecialtyId: res.mainSpecialtyId || null,
      additionalSpecialties: []
    };
  }

  async updateContact(data: Partial<DoctorContact>, doctorId: string): Promise<DoctorContact> {
    const res = await apiFetch<any>('/api/doctor/profile/contact-visibility', {
      method: 'PUT',
      body: JSON.stringify({
        doctorId,
        publicPhone: data.publicPhone,
        publicEmail: data.publicEmail,
        city: data.city,
        locationSummary: data.addressSummary,
        profileVisible: data.profileVisible,
        onlineConsultationAvailable: data.onlineConsultation
      })
    });
    
    return {
      id: doctorId,
      publicPhone: res.publicPhone || '',
      publicEmail: res.publicEmail || '',
      city: res.city || '',
      addressSummary: res.locationSummary || '',
      onlineConsultation: res.onlineConsultationAvailable || false,
      profileVisible: res.profileVisible || false
    };
  }

  async uploadPhoto(file: File, doctorId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await apiFetch<{ photoUrl: string }>(
      `/api/doctor/profile/photo?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    return res.photoUrl;
  }

  async removePhoto(_doctorId: string): Promise<void> {
    // No-op fallback if DELETE photo doesn't exist
  }

  async addEducation(data: Omit<EducationDoctor, 'id' | 'doctorId'>, doctorId: string): Promise<EducationDoctor> {
    return apiFetch<EducationDoctor>('/api/doctor/profile/education', {
      method: 'POST',
      body: JSON.stringify({
        doctorId,
        title: data.title,
        institution: data.institution,
        startYear: data.startYear,
        endYear: data.endYear,
        description: data.description
      })
    });
  }

  async updateEducation(id: string, data: Partial<EducationDoctor>, doctorId: string): Promise<void> {
    await apiFetch<void>(`/api/doctor/profile/education/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        doctorId,
        title: data.title,
        institution: data.institution,
        startYear: data.startYear,
        endYear: data.endYear,
        description: data.description
      })
    });
  }

  async deleteEducation(id: string, doctorId: string): Promise<void> {
    await apiFetch<void>(
      `/api/doctor/profile/education/${encodeURIComponent(id)}?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: 'DELETE'
      }
    );
  }

  async addExperience(data: Omit<ExperienceDoctor, 'id' | 'doctorId'>, doctorId: string): Promise<ExperienceDoctor> {
    const res = await apiFetch<any>('/api/doctor/profile/experience', {
      method: 'POST',
      body: JSON.stringify({
        doctorId,
        position: data.role,
        institution: data.institution,
        startYear: data.startYear,
        endYear: data.endYear,
        description: data.description
      })
    });
    return {
      id: res.id,
      doctorId: res.doctorId,
      role: res.position || '',
      institution: res.institution || '',
      startYear: res.startYear,
      endYear: res.endYear,
      description: res.description
    };
  }

  async updateExperience(id: string, data: Partial<ExperienceDoctor>, doctorId: string): Promise<void> {
    await apiFetch<void>(`/api/doctor/profile/experience/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        doctorId,
        position: data.role,
        institution: data.institution,
        startYear: data.startYear,
        endYear: data.endYear,
        description: data.description
      })
    });
  }

  async deleteExperience(id: string, doctorId: string): Promise<void> {
    await apiFetch<void>(
      `/api/doctor/profile/experience/${encodeURIComponent(id)}?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: 'DELETE'
      }
    );
  }

  async getSpecialtiesCatalog(): Promise<SpecialtyOption[]> {
    return apiFetch<SpecialtyOption[]>('/api/catalog/specialties');
  }
}

export const profileService = new ProfileService();