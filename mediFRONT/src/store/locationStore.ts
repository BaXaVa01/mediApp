import { create } from 'zustand';
import type { Doctor } from '../types/doctor';
import { profileService } from '../services/profileService';

interface LocationState {
  userCoords: [number, number] | null;
  setUserCoords: (coords: [number, number]) => void;
  clearUserCoords: () => void;

  // Search state
  searchQuery: string;
  searchResults: Doctor[];
  isSearching: boolean;
  searchError: string | null;

  setSearchQuery: (query: string) => void;
  searchProfessionals: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  userCoords: null,
  setUserCoords: (coords) => set({ userCoords: coords }),
  clearUserCoords: () => set({ userCoords: null }),

  // Search initial state
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchProfessionals: async (query: string) => {
    const trimmedQuery = query.trim();
    set({ searchQuery: query });

    // Preferencia MVP:
    // - si query tiene menos de 2 caracteres (pero no está vacío), no llamar backend y limpiar resultados de búsqueda
    // - si query está vacío, mostrar doctores destacados o todos usando GET /api/professionals
    if (trimmedQuery.length > 0 && trimmedQuery.length < 2) {
      set({ searchResults: [], isSearching: false, searchError: null });
      return;
    }

    set({ isSearching: true, searchError: null });

    try {
      let results: Doctor[];
      if (trimmedQuery === '') {
        results = await profileService.getAllProfessionals();
      } else {
        results = await profileService.searchProfessionals(trimmedQuery);
      }
      set({ searchResults: results, isSearching: false });
    } catch (err: any) {
      set({ 
        searchError: err.message || 'No se pudo realizar la búsqueda. Intentá de nuevo.', 
        isSearching: false,
        searchResults: []
      });
    }
  },

  clearSearch: () => set({ searchQuery: '', searchResults: [], isSearching: false, searchError: null }),
}));

