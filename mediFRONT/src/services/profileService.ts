import type { DoctorIdentity, DoctorContact, EducationDoctor, ExperienceDoctor, DoctorPublicProfile } from '../types/profile';

const mockIdentity: DoctorIdentity = {
  id: 'doc_123',
  userId: 'usr_123',
  professionalName: 'Dr. Julian Smith',
  headline: 'Cardiologist specialized in heart failure',
  biography: 'With over 15 years of experience, I focus on providing comprehensive cardiovascular care...',
  photoUrl: 'https://i.pravatar.cc/150?u=doc1',
  coverUrl: '',
  licenseNumber: 'MED-889922',
  yearsOfExperience: 15,
  verified: true,
  languagesSpoken: ['Spanish', 'English'],
  mainSpecialty: 'Cardiology',
  additionalSpecialties: ['Internal Medicine']
};

const mockContact: DoctorContact = {
  id: 'doc_123',
  publicPhone: '+1 555-0198',
  publicEmail: 'dr.smith@medifind.com',
  city: 'Managua',
  addressSummary: 'MediFind Center - Suite 4B',
  onlineConsultation: true,
  profileVisible: true
};

const mockEducation: EducationDoctor[] = [
  {
    id: 'edu_1',
    doctorId: 'doc_123',
    title: 'MD Cardiology',
    institution: 'National Medical University',
    startYear: 2005,
    endYear: 2011,
    description: 'Specialization with honors.'
  }
];

const mockExperience: ExperienceDoctor[] = [
  {
    id: 'exp_1',
    doctorId: 'doc_123',
    role: 'Head of Cardiology',
    institution: 'City Hospital',
    startYear: 2015,
    endYear: null,
    description: 'Leading the cardiovascular department.'
  }
];

// Mock API Delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class ProfileService {
  async getProfile(): Promise<DoctorPublicProfile> {
    await delay(600);
    return {
      identity: { ...mockIdentity },
      contact: { ...mockContact },
      education: [...mockEducation],
      experience: [...mockExperience]
    };
  }

  async updateIdentity(data: Partial<DoctorIdentity>): Promise<DoctorIdentity> {
    await delay(500);
    return { ...mockIdentity, ...data };
  }

  async updateContact(data: Partial<DoctorContact>): Promise<DoctorContact> {
    await delay(500);
    return { ...mockContact, ...data };
  }

  async uploadPhoto(file: File): Promise<string> {
    await delay(1000);
    // Mock returning an object URL for local preview
    return URL.createObjectURL(file);
  }

  async removePhoto(): Promise<void> {
    await delay(500);
  }

  async addEducation(data: Omit<EducationDoctor, 'id' | 'doctorId'>): Promise<EducationDoctor> {
    await delay(400);
    return { id: `edu_${Date.now()}`, doctorId: 'doc_123', ...data };
  }

  async updateEducation(_id: string, _data: Partial<EducationDoctor>): Promise<void> {
    await delay(400);
  }

  async deleteEducation(_id: string): Promise<void> {
    await delay(400);
  }

  async addExperience(data: Omit<ExperienceDoctor, 'id' | 'doctorId'>): Promise<ExperienceDoctor> {
    await delay(400);
    return { id: `exp_${Date.now()}`, doctorId: 'doc_123', ...data };
  }

  async updateExperience(_id: string, _data: Partial<ExperienceDoctor>): Promise<void> {
    await delay(400);
  }

  async deleteExperience(_id: string): Promise<void> {
    await delay(400);
  }
}

export const profileService = new ProfileService();