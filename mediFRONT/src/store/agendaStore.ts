import { create } from 'zustand';
import type { Appointment, ScheduleRequest } from '../utils/agendaMockData';
import { agendaService } from '../services/agendaService';

interface AgendaState {
  currentDate: Date;
  viewMode: 'daily' | 'weekly';
  activeFilters: string[];
  appointments: Appointment[];
  pendingRequests: ScheduleRequest[];
  selectedAppointment: Appointment | null;
  isPendingDrawerOpen: boolean;
  isRescheduleModalOpen: boolean;
  
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
  currentDate: new Date(2026, 5, 4), // Initialize at the app's "today"
  viewMode: 'weekly',
  activeFilters: ['confirmed', 'pending', 'In-Person', 'Online'],
  appointments: [],
  pendingRequests: [],
  selectedAppointment: null,
  isPendingDrawerOpen: false,
  isRescheduleModalOpen: false,

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
    get().setCurrentDate(new Date(2026, 5, 4));
  },

  fetchData: async () => {
    const { currentDate, viewMode } = get();
    let start = new Date(currentDate);
    let end = new Date(currentDate);
    
    if (viewMode === 'daily') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      // Sunday to Saturday
      start.setDate(currentDate.getDate() - currentDate.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    }

    const [apts, reqs] = await Promise.all([
      agendaService.getAppointments(start, end), 
      agendaService.getPendingRequests()
    ]);
    set({ appointments: apts, pendingRequests: reqs });
  },

  updateStatus: async (id, status) => {
    await agendaService.updateStatus(id, status);
    set((state) => ({
      appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a),
      selectedAppointment: state.selectedAppointment?.id === id ? { ...state.selectedAppointment, status } : state.selectedAppointment
    }));
  },

  reschedule: async (id, start, end) => {
    await agendaService.reschedule(id, start, end);
    set((state) => ({
      appointments: state.appointments.map(a => a.id === id ? { ...a, startTime: start, endTime: end } : a),
      selectedAppointment: state.selectedAppointment?.id === id ? { ...state.selectedAppointment, startTime: start, endTime: end } : state.selectedAppointment
    }));
  },

  acceptRequest: async (id) => {
    await new Promise(res => setTimeout(res, 400));
    set((state) => ({
      pendingRequests: state.pendingRequests.filter(req => req.id !== id)
    }));
  },

  rejectRequest: async (id) => {
    await new Promise(res => setTimeout(res, 400));
    set((state) => ({
      pendingRequests: state.pendingRequests.filter(req => req.id !== id)
    }));
  },

  proposeTime: async (id, _newDate) => {
    await new Promise(res => setTimeout(res, 400));
    set((state) => ({
      pendingRequests: state.pendingRequests.filter(req => req.id !== id)
    }));
  }
}));
