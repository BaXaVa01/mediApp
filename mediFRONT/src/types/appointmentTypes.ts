export type AppointmentSlot = {
  startTime: string;
  endTime: string;
  available: boolean;
};

export type AppointmentAvailabilityResponse = {
  doctorId: string;
  date: string;
  serviceId?: string;
  locationId?: string;
  slots: AppointmentSlot[];
};

export type CreateAppointmentRequest = {
  patientId?: string;
  doctorId: string;
  serviceId: string;
  locationId: string;
  date: string;
  startTime: string;
  reason?: string;
  notes?: string;
};

export type CreateAppointmentResponse = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  serviceName: string;
  locationId: string;
  locationName: string;
  clinicId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reservedPrice: number;
  reason?: string;
  message?: string;
};

export type DoctorService = {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  locationId?: string | null;
  locationName?: string;
  clinicId?: string | null;
  clinicName?: string;
  active: boolean;
};

export type DoctorLocation = {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  clinicId?: string | null;
  clinicName?: string;
  isMain?: boolean;
  active: boolean;
};
