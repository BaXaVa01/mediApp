import { create } from 'zustand';
import { mockServices, mockBlocks, mockSchedule, mockReminders, mockRules } from '../utils/configMockData';
import type { ServiceConfig, DaySchedule, WeeklySchedule, AvailabilityBlock, RemindersConfig, AppointmentRules } from '../utils/configMockData';

interface ConfigState {
  services: ServiceConfig[];
  blocks: AvailabilityBlock[];
  schedule: WeeklySchedule | null;
  reminders: RemindersConfig | null;
  rules: AppointmentRules | null;
  
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;

  fetchConfig: () => Promise<void>;
  
  addService: (service: Omit<ServiceConfig, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceConfig>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addBlock: (block: Omit<AvailabilityBlock, 'id'>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;

  updateScheduleDay: (day: keyof WeeklySchedule, data: DaySchedule) => void;
  saveSchedule: () => Promise<void>;

  updateReminders: (data: RemindersConfig) => Promise<void>;
  updateRules: (data: AppointmentRules) => Promise<void>;
}

const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useConfigStore = create<ConfigState>((set, get) => ({
  services: [],
  blocks: [],
  schedule: null,
  reminders: null,
  rules: null,
  
  isLoading: true,
  isSaving: false,
  saveSuccess: false,

  fetchConfig: async () => {
    set({ isLoading: true });
    await mockDelay(600); // GET /doctor/settings
    set({
      services: mockServices,
      blocks: mockBlocks,
      schedule: mockSchedule,
      reminders: mockReminders,
      rules: mockRules,
      isLoading: false
    });
  },

  addService: async (s) => {
    await mockDelay(400); // POST /doctor/settings/services
    const newService = { ...s, id: `srv_${Date.now()}` };
    set({ services: [...get().services, newService] });
  },

  updateService: async (id, s) => {
    await mockDelay(400); // PATCH /doctor/settings/services/:id
    set({ services: get().services.map(x => x.id === id ? { ...x, ...s } : x) });
  },

  deleteService: async (id) => {
    await mockDelay(400); // DELETE /doctor/settings/services/:id
    set({ services: get().services.filter(x => x.id !== id) });
  },

  addBlock: async (b) => {
    await mockDelay(400); // POST /doctor/settings/blocks
    const newBlock = { ...b, id: `blk_${Date.now()}` };
    set({ blocks: [...get().blocks, newBlock] });
  },

  deleteBlock: async (id) => {
    await mockDelay(400); // DELETE /doctor/settings/blocks/:id
    set({ blocks: get().blocks.filter(x => x.id !== id) });
  },

  updateScheduleDay: (day, data) => {
    const s = get().schedule;
    if (s) {
      set({ schedule: { ...s, [day]: data } });
    }
  },
  
  saveSchedule: async () => {
    set({ isSaving: true, saveSuccess: false });
    await mockDelay(500); // PUT /doctor/settings/schedule
    set({ isSaving: false, saveSuccess: true });
    setTimeout(() => set({ saveSuccess: false }), 2000);
  },

  updateReminders: async (data) => {
    set({ isSaving: true, saveSuccess: false });
    await mockDelay(500); // PUT /doctor/settings/reminders
    set({ reminders: data, isSaving: false, saveSuccess: true });
    setTimeout(() => set({ saveSuccess: false }), 2000);
  },

  updateRules: async (data) => {
    set({ isSaving: true, saveSuccess: false });
    await mockDelay(500); // PUT /doctor/settings/rules
    set({ rules: data, isSaving: false, saveSuccess: true });
    setTimeout(() => set({ saveSuccess: false }), 2000);
  }
}));