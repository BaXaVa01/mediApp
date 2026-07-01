export interface EducationDoctor {
  id: string;
  doctorId: string;
  title: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description?: string;
}

export interface ExperienceDoctor {
  id: string;
  doctorId: string;
  role: string;
  institution: string;
  startYear: number;
  endYear: number | null; // null means "currently working"
  description?: string;
}

export interface DoctorIdentity {
  id: string;
  userId: string;
  professionalName: string;
  headline: string;
  biography: string;
  photoUrl: string;
  coverUrl?: string;
  licenseNumber: string;
  yearsOfExperience: number;
  verified: boolean;
  languagesSpoken: string[];
  mainSpecialty: string;
  mainSpecialtyId?: string | null;
  additionalSpecialties: string[];
}

export interface DoctorContact {
  id: string;
  publicPhone: string;
  publicEmail: string;
  city: string;
  addressSummary: string;
  onlineConsultation: boolean;
  profileVisible: boolean;
}

export interface DoctorPublicProfile {
  identity: DoctorIdentity;
  contact: DoctorContact;
  education: EducationDoctor[];
  experience: ExperienceDoctor[];
}

export interface SpecialtyOption {
  id: string;
  name: string;
  description?: string | null;
}