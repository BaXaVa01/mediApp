import { apiFetch } from '../lib/api';

export interface DoctorCalendarAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
  };
  case: {
    serviceId?: string;
    serviceName?: string;
    reason?: string;
    notes?: string;
    reservedPrice?: number;
  };
  location: {
    id: string;
    name: string;
    type?: string;
    address?: string;
    city?: string;
    clinicId?: string | null;
    clinicName?: string;
  };
}

export interface DoctorWeeklyCalendarResponse {
  doctorId: string;
  weekStart: string;
  weekEnd: string;
  appointments: DoctorCalendarAppointment[];
}

export interface PendingAppointmentsPageResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  items: DoctorCalendarAppointment[];
}

export interface AppointmentDecisionResponse {
  appointmentId: string;
  status: string;
  message: string;
}

function normalizePage(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return 0;
  return parsed;
}

function normalizeSize(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return 10;
  if (parsed > 50) return 50;
  return parsed;
}

class AgendaService {
  async getDoctorWeeklyCalendar(doctorId: string, weekStart: string): Promise<DoctorWeeklyCalendarResponse> {
    if (import.meta.env.DEV) {
      console.debug("[DoctorDashboard] doctorId", doctorId);
      console.debug("[DoctorDashboard] weekStart", weekStart);
    }
    return apiFetch<DoctorWeeklyCalendarResponse>(
      `/api/doctors/${encodeURIComponent(doctorId)}/appointments/calendar?weekStart=${encodeURIComponent(weekStart)}`
    );
  }

  async getPendingAppointments(doctorId: string, page = 0, size = 10): Promise<PendingAppointmentsPageResponse> {
    const safePage = normalizePage(page);
    const safeSize = normalizeSize(size);
    const url = `/api/doctor/appointments/pending?doctorId=${encodeURIComponent(doctorId)}&page=${safePage}&size=${safeSize}`;

    if (import.meta.env.DEV) {
      console.debug("[DoctorDashboard] pending pagination", { page: safePage, size: safeSize });
      console.debug("[AgendaService.getPendingAppointments] params", {
        doctorId,
        page: safePage,
        size: safeSize,
        url
      });
    }

    return apiFetch<PendingAppointmentsPageResponse>(url);
  }

  async updateAppointmentDecision(
    appointmentId: string, 
    doctorId: string, 
    decision: 'ACCEPT' | 'REJECT', 
    notes?: string
  ): Promise<AppointmentDecisionResponse> {
    return apiFetch<AppointmentDecisionResponse>(
      `/api/doctor/appointments/${encodeURIComponent(appointmentId)}/decision`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          doctorId,
          decision,
          notes: notes || (decision === 'ACCEPT' ? 'Confirmada por el doctor' : 'No disponible en ese horario')
        })
      }
    );
  }
}

export const agendaService = new AgendaService();