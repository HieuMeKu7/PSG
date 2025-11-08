import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SceneRecord, UserName, ViewType, RecordStatus } from '../types';

interface AppState {
  // User
  currentUser: UserName | null;
  setCurrentUser: (user: UserName | null) => void;

  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Records
  records: SceneRecord[];
  addRecord: (record: SceneRecord) => void;
  updateRecord: (id: string, updates: Partial<SceneRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => SceneRecord | undefined;

  // Selected record
  selectedRecord: SceneRecord | null;
  setSelectedRecord: (record: SceneRecord | null) => void;

  // Filters
  filters: {
    episode?: string;
    technique?: string;
    status?: RecordStatus;
    user?: UserName;
    searchTerm?: string;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
  clearFilters: () => void;

  // Utility
  getFilteredRecords: () => SceneRecord[];
  exportData: () => string; // JSON export
  importData: (data: string) => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      currentView: 'dashboard',
      records: [],
      selectedRecord: null,
      filters: {},

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),

      // Navigation actions
      setCurrentView: (view) => set({ currentView: view }),

      // Record actions
      addRecord: (record) =>
        set((state) => ({
          records: [...state.records, {
            ...record,
            created_at: new Date().toISOString(),
            created_by: state.currentUser || 'Hieu'
          }]
        })),

      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? {
                  ...record,
                  ...updates,
                  updated_at: new Date().toISOString(),
                  updated_by: state.currentUser || undefined
                }
              : record
          )
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
          selectedRecord: state.selectedRecord?.id === id ? null : state.selectedRecord
        })),

      getRecord: (id) => {
        return get().records.find((record) => record.id === id);
      },

      // Selected record actions
      setSelectedRecord: (record) => set({ selectedRecord: record }),

      // Filter actions
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters }
        })),

      clearFilters: () => set({ filters: {} }),

      // Utility actions
      getFilteredRecords: () => {
        const { records, filters } = get();
        let filtered = [...records];

        if (filters.episode) {
          filtered = filtered.filter((r) => r.episode_id === filters.episode);
        }

        if (filters.technique) {
          filtered = filtered.filter((r) => r.techniques.includes(filters.technique!));
        }

        if (filters.status) {
          filtered = filtered.filter((r) => r.status === filters.status);
        }

        if (filters.user) {
          filtered = filtered.filter((r) => r.created_by === filters.user);
        }

        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.frame_description.toLowerCase().includes(term) ||
              r.quoted_lines?.toLowerCase().includes(term) ||
              r.narrative_function.toLowerCase().includes(term) ||
              r.tags?.some((tag) => tag.toLowerCase().includes(term))
          );
        }

        return filtered;
      },

      exportData: () => {
        const { records } = get();
        return JSON.stringify(records, null, 2);
      },

      importData: (data) => {
        try {
          const records = JSON.parse(data) as SceneRecord[];
          set({ records });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      clearAllData: () =>
        set({
          records: [],
          selectedRecord: null,
          filters: {}
        })
    }),
    {
      name: 'psg-research-storage',
      version: 1
    }
  )
);
