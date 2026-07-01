import { create } from 'zustand';
import type { Appointment, ScheduleRequest } from '../utils/agendaMockData';
import { agendaService, type DoctorCalendarAppointment } from '../services/agendaService';
import { getAuthUser, clearAuthSession } from '../auth/authCookies';
import { getDoctorAppointmentErrorMessage } from '../utils/appointmentErrors';

// Utility functions for Monday of the week calculation
function getMonday(d: Date): Date {
  const day = d.getDay();
  // if day is Sunday (0), we subtract 6, otherwise we subtract (day - 1)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function mapAppointment(apiApt: DoctorCalendarAppointment): Appointment {
  const startParts = apiApt.startTime.split(':');
  const endParts = apiApt.endTime.split(':');
  
  const startTime = new Date(apiApt.date);
  startTime.setHours(parseInt(startParts[0] || '0', 10), parseInt(startParts[1] || '0', 10), 0, 0);

  const endTime = new Date(apiApt.date);
  endTime.setHours(parseInt(endParts[0] || '0', 10), parseInt(endParts[1] || '0', 10), 0, 0);

  let modality: Appointment['modality'] = 'In-Person';
  if (apiApt.location?.type === 'ONLINE') {
    modality = 'Online';
  } else if (apiApt.location?.type === 'DOMICILIO') {
    modality = 'Home Visit';
  }

  let status: Appointment['status'] = 'pending';
  if (apiApt.status === 'Confirmada') {
    status = 'confirmed';
  } else if (apiApt.status === 'Rechazada' || apiApt.status === 'Cancelada') {
    status = 'cancelled';
  } else if (apiApt.status === 'Completada') {
    status = 'completed';
  } else {
    const lowercaseStatus = apiApt.status.toLowerCase();
    if (['pending', 'confirmed', 'cancelled', 'completed'].includes(lowercaseStatus)) {
      status = lowercaseStatus as Appointment['status'];
    }
  }

  return {
    id: apiApt.id,
    patientId: apiApt.patient?.id || '',
    patientName: apiApt.patient?.name || 'Paciente',
    service: apiApt.case?.serviceName || 'Consulta',
    startTime,
    endTime,
    modality,
    price: apiApt.case?.reservedPrice || 0,
    location: `${apiApt.location?.name || ''} ${apiApt.location?.address || ''}`.trim() || 'Consultorio',
    status,
    notes: apiApt.case?.notes || apiApt.case?.reason || ''
  };
}

function mapPendingRequest(apiApt: DoctorCalendarAppointment): ScheduleRequest {
  const startParts = apiApt.startTime.split(':');
  const requestedDate = new Date(apiApt.date);
  requestedDate.setHours(parseInt(startParts[0] || '0', 10), parseInt(startParts[1] || '0', 10), 0, 0);

  let modality: Appointment['modality'] = 'In-Person';
  if (apiApt.location?.type === 'ONLINE') {
    modality = 'Online';
  } else if (apiApt.location?.type === 'DOMICILIO') {
    modality = 'Home Visit';
  }

  return {
    id: apiApt.id,
    patientName: apiApt.patient?.name || 'Paciente',
    service: apiApt.case?.serviceName || 'Consulta',
    requestedDate,
    modality
  };
}

interface AgendaState {
  currentDate: Date;
  viewMode: 'daily' | 'weekly';
  activeFilters: string[];
  appointments: Appointment[];
  pendingRequests: ScheduleRequest[];
  selectedAppointment: Appointment | null;
  isPendingDrawerOpen: boolean;
  isRescheduleModalOpen: boolean;
  pendingPage: number;
  pendingSize: number;
  pendingTotalElements: number;
  pendingTotalPages: number;
  
  // Weekly bounds from API
  currentWeekStart: string;
  currentWeekEnd: string;
  
  // Loading & Error states
  isLoadingCalendar: boolean;
  isLoadingPending: boolean;
  isUpdatingDecision: boolean;
  calendarError: string | null;
  pendingError: string | null;
  decisionError: string | null;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'daily' | 'weekly') => void;
  toggleFilter: (filter: string) => void;
  setSelectedAppointment: (apt: Appointment | null) => void;
  setPendingDrawerOpen: (open: boolean) => void;
  setRescheduleModalOpen: (open: boolean) => void;
  
  // Navigation
  nextDate: () => void;
  prevDate: () => void;
  goToToday: () => void;
  
  // Data actions
  fetchData: () => Promise<void>;
  updateStatus: (id: string, status: Appointment['status']) => Promise<void>;
  reschedule: (id: string, start: Date, end: Date) => Promise<void>;
  acceptRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  proposeTime: (id: string, newDate: Date) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>((set, get) => ({
  currentDate: new Date(),
  viewMode: 'weekly',
  activeFilters: ['confirmed', 'pending', 'In-Person', 'Online'],
  appointments: [],
  pendingRequests: [],
  selectedAppointment: null,
  isPendingDrawerOpen: false,
  isRescheduleModalOpen: false,
  pendingPage: 0,
  pendingSize: 10,
  pendingTotalElements: 0,
  pendingTotalPages: 0,
  
  currentWeekStart: '',
  currentWeekEnd: '',
  
  isLoadingCalendar: false,
  isLoadingPending: false,
  isUpdatingDecision: false,
  calendarError: null,
  pendingError: null,
  decisionError: null,

  setCurrentDate: (date) => {
    set({ currentDate: date });
    get().fetchData();
  },
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  toggleFilter: (filter) => {
    const filters = get().activeFilters;
    set({ activeFilters: filters.includes(filter) ? filters.filter(f => f !== filter) : [...filters, filter] });
  },
  
  setSelectedAppointment: (apt) => set({ selectedAppointment: apt }),
  setPendingDrawerOpen: (open) => set({ isPendingDrawerOpen: open }),
  setRescheduleModalOpen: (open) => set({ isRescheduleModalOpen: open }),

  nextDate: () => {
    const { currentDate, viewMode } = get();
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    get().setCurrentDate(newDate);
  },

  prevDate: () => {
    const { currentDate, viewMode } = get();
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    get().setCurrentDate(newDate);
  },

  goToToday: () => {
    get().setCurrentDate(new Date());
  },

  fetchData: async () => {
    const user = getAuthUser();
    if (!user || (user.accountType !== 'DOCTOR' && user.role !== 'DOCTOR')) {
      console.warn('User has no active doctor session to fetch agenda.');
      return;
    }
    const doctorId = user.profileId;

    const { currentDate } = get();
    const monday = getMonday(currentDate);
    const weekStartStr = formatDate(monday);

    set({ 
      isLoadingCalendar: true, 
      isLoadingPending: true, 
      calendarError: null, 
      pendingError: null 
    });

    // 1. Fetch weekly calendar
    const fetchCalendarPromise = (async () => {
      try {
        const weeklyResponse = await agendaService.getDoctorWeeklyCalendar(doctorId, weekStartStr);
        const apts = (weeklyResponse.appointments || []).map(mapAppointment);
        set({
          appointments: apts,
          currentWeekStart: weeklyResponse.weekStart,
          currentWeekEnd: weeklyResponse.weekEnd,
          isLoadingCalendar: false,
          calendarError: null
        });
      } catch (err: any) {
        console.error('Error fetching doctor weekly calendar:', err);
        const errMsg = getDoctorAppointmentErrorMessage(err);
        set({
          calendarError: errMsg,
          isLoadingCalendar: false
        });
        if (err?.status === 401 || err?.code === 'UNAUTHORIZED') {
          clearAuthSession();
          window.location.href = '/login';
        }
      }
    })();

    // 2. Fetch pending appointments
    const fetchPendingPromise = (async () => {
      try {
        const pendingResponse = await agendaService.getPendingAppointments(doctorId, 0, 10);
        const pendingReqs = (pendingResponse.items || []).map(mapPendingRequest);
        set({
          pendingRequests: pendingReqs,
          pendingPage: pendingResponse.page || 0,
          pendingSize: pendingResponse.size || 10,
          pendingTotalElements: pendingResponse.totalElements || 0,
          pendingTotalPages: pendingResponse.totalPages || 0,
          isLoadingPending: false,
          pendingError: null
        });
      } catch (err: any) {
        console.error('Error fetching doctor pending appointments:', err);
        const errMsg = getDoctorAppointmentErrorMessage(err);
        set({
          pendingError: errMsg,
          isLoadingPending: false
        });
      }
    })();

    await Promise.all([fetchCalendarPromise, fetchPendingPromise]);
  },

  updateStatus: async (id, status) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isUpdatingDecision: true, decisionError: null });
    try {
      if (status === 'confirmed') {
        await agendaService.updateAppointmentDecision(id, doctorId, 'ACCEPT');
      } else if (status === 'cancelled') {
        await agendaService.updateAppointmentDecision(id, doctorId, 'REJECT');
      }
      
      set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a),
        selectedAppointment: state.selectedAppointment?.id === id ? { ...state.selectedAppointment, status } : state.selectedAppointment
      }));
      
      await get().fetchData();
    } catch (err: any) {
      console.error('Error updating appointment status decision:', err);
      const errMsg = getDoctorAppointmentErrorMessage(err);
      set({ decisionError: errMsg });
      alert(errMsg);
    } finally {
      set({ isUpdatingDecision: false });
    }
  },

  reschedule: async (_id, _start, _end) => {
    // Backend API docs don't define a reschedule endpoint for doctor calendar directly,
    // so we keep a mock simulation or throw error if not supported.
    console.warn('Reschedule endpoint not supported by current API-docs.');
  },

  acceptRequest: async (id) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isUpdatingDecision: true, decisionError: null });
    try {
      await agendaService.updateAppointmentDecision(id, doctorId, 'ACCEPT');
      await get().fetchData();
    } catch (err: any) {
      console.error('Error accepting appointment request:', err);
      const errMsg = getDoctorAppointmentErrorMessage(err);
      set({ decisionError: errMsg });
      alert(errMsg);
    } finally {
      set({ isUpdatingDecision: false });
    }
  },

  rejectRequest: async (id) => {
    const user = getAuthUser();
    if (!user) return;
    const doctorId = user.profileId;

    set({ isUpdatingDecision: true, decisionError: null });
    try {
      await agendaService.updateAppointmentDecision(id, doctorId, 'REJECT');
      await get().fetchData();
    } catch (err: any) {
      console.error('Error rejecting appointment request:', err);
      const errMsg = getDoctorAppointmentErrorMessage(err);
      set({ decisionError: errMsg });
      alert(errMsg);
    } finally {
      set({ isUpdatingDecision: false });
    }
  },

  proposeTime: async (_id, _newDate) => {
    console.warn('Propose time not supported by current API-docs.');
  }
}));
