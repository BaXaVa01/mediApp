import { apiFetch } from '../lib/api';

export interface DoctorScheduleBlock {
  id?: string;
  locationId: string;
  locationName?: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  appointmentDurationMinutes: number;
  active?: boolean;
}

export interface DoctorDaySchedule {
  dayOfWeek: number; // 1-7
  dayName?: string;
  blocks: DoctorScheduleBlock[];
}

export interface DoctorScheduleResponse {
  doctorId: string;
  schedule: DoctorDaySchedule[];
}

export interface ReplaceDoctorScheduleRequest {
  doctorId: string;
  schedule: DoctorDaySchedule[];
}

export interface DoctorLocation {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  clinicId?: string | null;
  clinicName?: string;
  isMain?: boolean;
  active: boolean;
}

class DoctorScheduleService {
  async getDoctorSchedule(doctorId: string): Promise<DoctorScheduleResponse> {
    return apiFetch<DoctorScheduleResponse>(
      `/api/doctor/settings/schedule?doctorId=${encodeURIComponent(doctorId)}`
    );
  }

  async replaceDoctorSchedule(payload: ReplaceDoctorScheduleRequest): Promise<DoctorScheduleResponse> {
    return apiFetch<DoctorScheduleResponse>('/api/doctor/settings/schedule', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async getDoctorLocations(doctorId: string): Promise<DoctorLocation[]> {
    return apiFetch<DoctorLocation[]>(
      `/api/doctor/locations?doctorId=${encodeURIComponent(doctorId)}`
    );
  }
}

export const doctorScheduleService = new DoctorScheduleService();

export function getScheduleErrorMessage(error: any): string {
  const code = error?.code || error?.response?.data?.error;
  switch (code) {
    case "INVALID_LOCATION":
      return "El lugar seleccionado ya no está disponible. Actualizá tus lugares de atención.";
    case "OVERLAPPING_SCHEDULE_BLOCKS":
      return "Hay bloques traslapados. Revisá los horarios del día.";
    case "INVALID_DAY_OF_WEEK":
      return "Uno de los días configurados no es válido.";
    case "INVALID_TIME_RANGE":
      return "Revisá las horas de inicio y fin de tus bloques. La hora de inicio debe ser anterior a la hora de fin.";
    case "INVALID_APPOINTMENT_DURATION":
      return "La duración de la cita no cabe dentro de uno de los bloques.";
    case "DOCTOR_NOT_FOUND":
      return "No encontramos tu perfil de doctor. Cerrá sesión e iniciá nuevamente.";
    case "VALIDATION_ERROR":
      return "Revisá los horarios configurados e intentá nuevamente.";
    default:
      return error?.message || "No pudimos guardar tus horarios. Intentá nuevamente.";
  }
}
