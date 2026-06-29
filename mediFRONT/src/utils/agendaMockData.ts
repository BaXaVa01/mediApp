export type ApptStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type ApptModality = 'In-Person' | 'Online' | 'Home Visit';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  service: string;
  startTime: Date;
  endTime: Date;
  modality: ApptModality;
  price: number;
  location: string;
  status: ApptStatus;
  notes?: string;
}

export interface ScheduleRequest {
  id: string;
  patientName: string;
  service: string;
  requestedDate: Date;
  modality: ApptModality;
}

// Today is Thursday 2026-06-04
const today = new Date(2026, 5, 4); 
today.setHours(0, 0, 0, 0);

// Helper to get date for current week (Sun-Sat)
const getDayInWeek = (dayIndex: number) => {
  const d = new Date(2026, 5, 4); // Start with today
  d.setDate(d.getDate() - d.getDay() + dayIndex); // Subtract today's index and add target
  d.setHours(0, 0, 0, 0);
  return d;
};

export const mockAppointments: Appointment[] = [
  // MONDAY 01/06
  {
    id: 'apt_mon_1',
    patientId: 'MF-0001',
    patientName: 'John Marston',
    service: 'Initial Consultation',
    startTime: new Date(getDayInWeek(1).getTime() + 9 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(1).getTime() + 10 * 60 * 60 * 1000),
    modality: 'In-Person',
    price: 100,
    location: 'MediFind Center - Suite 1',
    status: 'completed',
  },
  
  // TUESDAY 02/06
  {
    id: 'apt_tue_1',
    patientId: 'MF-0002',
    patientName: 'Sadie Adler',
    service: 'Follow-up',
    startTime: new Date(getDayInWeek(2).getTime() + 11 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(2).getTime() + 11.5 * 60 * 60 * 1000),
    modality: 'Online',
    price: 80,
    location: 'Zoom',
    status: 'completed',
  },

  // WEDNESDAY 03/06
  {
    id: 'apt_wed_1',
    patientId: 'MF-0003',
    patientName: 'Charles Smith',
    service: 'Emergency Checkup',
    startTime: new Date(getDayInWeek(3).getTime() + 14 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(3).getTime() + 15 * 60 * 60 * 1000),
    modality: 'In-Person',
    price: 150,
    location: 'MediFind Center - Suite 1',
    status: 'completed',
  },

  // THURSDAY 04/06 (TODAY)
  {
    id: 'apt_today_1',
    patientId: 'MF-8829',
    patientName: 'Arthur Morgan',
    patientAvatar: 'https://i.pravatar.cc/150?u=arthur',
    service: 'General Consultation',
    startTime: new Date(getDayInWeek(4).getTime() + 9 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(4).getTime() + 9.75 * 60 * 60 * 1000),
    modality: 'In-Person',
    price: 120,
    location: 'MediFind Center - Suite 4B',
    status: 'confirmed',
  },
  {
    id: 'apt_today_2',
    patientId: 'MF-4412',
    patientName: 'Dutch van der Linde',
    service: 'Executive Review',
    startTime: new Date(getDayInWeek(4).getTime() + 13 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(4).getTime() + 14 * 60 * 60 * 1000),
    modality: 'Online',
    price: 200,
    location: 'Google Meet',
    status: 'pending',
  },

  // FRIDAY 05/06
  {
    id: 'apt_fri_1',
    patientId: 'MF-0004',
    patientName: 'Hosea Matthews',
    service: 'Therapy Session',
    startTime: new Date(getDayInWeek(5).getTime() + 10 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(5).getTime() + 11.5 * 60 * 60 * 1000),
    modality: 'In-Person',
    price: 90,
    location: 'MediFind Center - Suite 2',
    status: 'confirmed',
  },

  // SATURDAY 06/06
  {
    id: 'apt_sat_1',
    patientId: 'MF-0005',
    patientName: 'Lenny Summers',
    service: 'Routine Screening',
    startTime: new Date(getDayInWeek(6).getTime() + 8 * 60 * 60 * 1000),
    endTime: new Date(getDayInWeek(6).getTime() + 9 * 60 * 60 * 1000),
    modality: 'In-Person',
    price: 60,
    location: 'MediFind Center - Suite 1',
    status: 'confirmed',
  }
];

export const mockRequests: ScheduleRequest[] = [
  {
    id: 'req_1',
    patientName: 'Javier Escuella',
    service: 'Initial Consult',
    requestedDate: new Date(today.getTime() + 48 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
    modality: 'Online'
  }
];
