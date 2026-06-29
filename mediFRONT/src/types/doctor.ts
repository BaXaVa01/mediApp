export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface AvailabilitySlot {
  date: string;
  time: string;
}

export interface ServiceDetail {
  name: string;
  price: number;
  duration?: string;
}

export interface CareLocation {
  name: string;
  address: string;
  phone: string;
  availability: string;
}

export interface Review {
  patientName: string;
  comment: string;
  rating: number;
  date: string;
}

export interface ScheduleDay {
  day: string;
  hours: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewCount: number;
  price: number;
  photo: string;
  location: Location;
  locations: Location[];
  availability: string[];
  availabilityPreview: AvailabilitySlot[];
  consultationTypes: ('Presencial' | 'En línea' | 'A domicilio')[];
  insurance: string[];
  titles: string[];
  experience: string;
  services: string[]; // Keep for compatibility
  
  // New Fields
  licenseNumber: string;
  diseasesTreated: string[];
  patientTypes: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  publications: string[];
  awards: string[];
  servicesDetails: ServiceDetail[];
  careLocations: CareLocation[];
  gallery: string[];
  reviews: Review[];
  schedule: ScheduleDay[];
  appointments: Appointment[];
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  date: string;
  type: 'Consulta' | 'Seguimiento' | 'Urgencia';
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}
