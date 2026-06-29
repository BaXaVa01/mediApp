import { mockAppointments, mockRequests } from '../utils/agendaMockData';
import type { Appointment, ScheduleRequest } from '../utils/agendaMockData';

export interface BookingSlot {
  time: string;
  available: boolean;
}

export interface BookingDay {
  date: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  slots: BookingSlot[];
}

// Frontend Service simulating backend calls
class AgendaService {
  async getAppointments(start: Date, end: Date): Promise<Appointment[]> {
    // Simulate API filtering by date range
    const filtered = mockAppointments.filter(apt => {
      const aptTime = new Date(apt.startTime).getTime();
      return aptTime >= start.getTime() && aptTime <= end.getTime();
    });
    return new Promise((resolve) => setTimeout(() => resolve([...filtered]), 300));
  }

  async getPendingRequests(): Promise<ScheduleRequest[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...mockRequests]), 300));
  }

  async updateStatus(_id: string, _status: Appointment['status']): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  async reschedule(_id: string, _newStart: Date, _newEnd: Date): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  async sendReminder(_id: string): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  async getDoctorBookingSchedule(_doctorId: string): Promise<BookingDay[]> {
    const days: BookingDay[] = [
      {
        date: '2026-05-12',
        dayName: 'Mar',
        dayNumber: 12,
        monthName: 'May',
        slots: [
          { time: '11:00', available: false },
          { time: '12:00', available: true },
          { time: '13:00', available: true },
          { time: '14:00', available: false },
          { time: '15:00', available: true },
        ]
      },
      {
        date: '2026-05-13',
        dayName: 'Mié',
        dayNumber: 13,
        monthName: 'May',
        slots: [
          { time: '11:00', available: true },
          { time: '12:00', available: false },
          { time: '13:00', available: false },
          { time: '14:00', available: false },
          { time: '15:00', available: true },
        ]
      },
      {
        date: '2026-05-14',
        dayName: 'Jue',
        dayNumber: 14,
        monthName: 'May',
        slots: [
          { time: '11:00', available: true },
          { time: '12:00', available: true },
          { time: '13:00', available: true },
          { time: '14:00', available: true },
          { time: '15:00', available: true },
        ]
      },
      {
        date: '2026-05-15',
        dayName: 'Vie',
        dayNumber: 15,
        monthName: 'May',
        slots: [
          { time: '11:00', available: false },
          { time: '12:00', available: false },
          { time: '13:00', available: false },
          { time: '14:00', available: false },
          { time: '15:00', available: false },
        ]
      }
    ];

    return new Promise((resolve) => setTimeout(() => resolve(days), 500));
  }
}

export const agendaService = new AgendaService();