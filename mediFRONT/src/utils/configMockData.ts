export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  modality: 'In-Person' | 'Online' | 'Both';
  visible: boolean;
  confirmationMode: 'Automatic' | 'Manual';
}

export interface DaySchedule {
  enabled: boolean;
  timeRanges: { start: string; end: string }[];
  duration: number; // minutes
  buffer: number; // minutes
  modality: 'In-Person' | 'Online' | 'Both';
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface AvailabilityBlock {
  id: string;
  date: Date;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  reason: string;
}

export interface RemindersConfig {
  patient: {
    enabled: boolean;
    times: ('24h' | '12h' | '2h')[];
  };
  doctor: {
    enabled: boolean;
    time: '15min' | '30min' | '1h' | '2h';
  };
}

export interface AppointmentRules {
  minTimeBeforeBooking: number; // hours
  maxDaysInAdvance: number; // days
  cancellationLimit: '12h' | '24h';
  allowReschedule: boolean;
  rescheduleLimit: '12h' | '24h';
  autoConfirm: boolean;
  allowOnline: boolean;
  allowPatientCancel: boolean;
}

export const mockServices: ServiceConfig[] = [
  {
    id: 'srv_1',
    name: 'Cardiology Consultation',
    description: 'Initial assessment and cardiovascular checkup.',
    price: 150,
    duration: 45,
    modality: 'In-Person',
    visible: true,
    confirmationMode: 'Automatic'
  },
  {
    id: 'srv_2',
    name: 'Follow-up / EKG Review',
    description: 'Review of tests and adjustment of treatment.',
    price: 90,
    duration: 30,
    modality: 'Both',
    visible: true,
    confirmationMode: 'Manual'
  }
];

export const mockBlocks: AvailabilityBlock[] = [
  {
    id: 'blk_1',
    date: new Date(new Date().getTime() + 86400000 * 2), // 2 days from now
    allDay: true,
    reason: 'Medical Conference'
  }
];

export const mockSchedule: WeeklySchedule = {
  monday: { enabled: true, timeRanges: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }], duration: 45, buffer: 15, modality: 'In-Person' },
  tuesday: { enabled: true, timeRanges: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }], duration: 45, buffer: 15, modality: 'In-Person' },
  wednesday: { enabled: true, timeRanges: [{ start: '09:00', end: '13:00' }], duration: 30, buffer: 10, modality: 'Both' },
  thursday: { enabled: true, timeRanges: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }], duration: 45, buffer: 15, modality: 'In-Person' },
  friday: { enabled: true, timeRanges: [{ start: '09:00', end: '14:00' }], duration: 30, buffer: 0, modality: 'Online' },
  saturday: { enabled: false, timeRanges: [], duration: 30, buffer: 0, modality: 'In-Person' },
  sunday: { enabled: false, timeRanges: [], duration: 30, buffer: 0, modality: 'In-Person' }
};

export const mockReminders: RemindersConfig = {
  patient: { enabled: true, times: ['24h', '2h'] },
  doctor: { enabled: true, time: '15min' }
};

export const mockRules: AppointmentRules = {
  minTimeBeforeBooking: 12,
  maxDaysInAdvance: 30,
  cancellationLimit: '24h',
  allowReschedule: true,
  rescheduleLimit: '12h',
  autoConfirm: false,
  allowOnline: true,
  allowPatientCancel: true
};