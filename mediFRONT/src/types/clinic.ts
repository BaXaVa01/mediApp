import type { Location, AvailabilitySlot } from './doctor';

export interface Clinic {
  id: string;
  name: string;
  bio: string;
  logo: string;
  rating: number;
  reviewCount: number;
  location: Location;
  locations: Location[];
  availabilityPreview: AvailabilitySlot[];
  consultationTypes: ('Presencial' | 'En línea' | 'A domicilio')[];
  doctors: string[];
  services: string[];
}
