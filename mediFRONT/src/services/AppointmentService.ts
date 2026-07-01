import { apiFetch } from '../lib/api';
import type { 
  AppointmentAvailabilityResponse, 
  CreateAppointmentRequest, 
  CreateAppointmentResponse, 
  DoctorService, 
  DoctorLocation 
} from '../types/appointmentTypes';

export class AppointmentService {
  async getDoctorServices(doctorId: string): Promise<DoctorService[]> {
    const response = await apiFetch<{ doctorId: string; services: DoctorService[] }>(
      `/api/doctor/services?doctorId=${encodeURIComponent(doctorId)}`
    );
    return response.services || [];
  }

  async getDoctorLocations(doctorId: string): Promise<DoctorLocation[]> {
    return apiFetch<DoctorLocation[]>(
      `/api/doctor/locations?doctorId=${encodeURIComponent(doctorId)}`
    );
  }

  async getAvailability(params: { 
    doctorId: string; 
    date: string; 
    serviceId: string; 
    locationId: string; 
  }): Promise<AppointmentAvailabilityResponse> {
    const { doctorId, date, serviceId, locationId } = params;
    return apiFetch<AppointmentAvailabilityResponse>(
      `/api/appointments/availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}&locationId=${encodeURIComponent(locationId)}`
    );
  }

  async createAppointment(payload: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    return apiFetch<CreateAppointmentResponse>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const appointmentService = new AppointmentService();

export function getAppointmentErrorMessage(error: any): string {
  // Check both ApiError structure (error.code) and raw response structure if any
  const code = error?.code || error?.response?.data?.error;
  switch (code) {
    case "SLOT_ALREADY_TAKEN":
      return "Ese horario acaba de ser reservado por otra persona. Elegí otro horario.";
    case "SLOT_BLOCKED":
      return "El doctor bloqueó ese horario. Elegí otro horario disponible.";
    case "PAST_APPOINTMENT":
      return "No podés reservar una cita en una fecha u hora pasada.";
    case "OUTSIDE_WORKING_HOURS":
      return "El horario seleccionado está fuera del horario de atención del doctor.";
    case "DOCTOR_NOT_FOUND":
      return "No encontramos este doctor. Volvé a buscar otro profesional.";
    case "PATIENT_NOT_FOUND":
      return "No encontramos tu perfil de paciente. Cerrá sesión e iniciá nuevamente.";
    case "INVALID_SERVICE":
      return "El servicio seleccionado ya no está disponible. Elegí otro servicio.";
    case "INVALID_LOCATION":
      return "El lugar seleccionado ya no está disponible. Elegí otro lugar de atención.";
    case "UNAUTHORIZED":
    case 401:
      return "Tu sesión expiró. Iniciá sesión nuevamente para reservar.";
    case "FORBIDDEN":
    case 403:
      return "No tenés permisos para reservar esta cita.";
    case "VALIDATION_ERROR":
      return "Revisá los datos de la cita e intentá nuevamente.";
    case "NETWORK_ERROR":
      return "No pudimos conectar con el servidor. Revisá tu conexión o intentá más tarde.";
    default:
      return error?.message || "No se pudo reservar la cita. Intentá de nuevo.";
  }
}
