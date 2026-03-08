import { create } from "zustand";
import type { User, Project, Agent, Opportunity, Notification } from "@/types";
import {
  mockUser,
  mockProjects,
  mockAgents,
  mockOpportunities,
  mockNotifications,
} from "@/lib/mock-data";

interface AppState {
  user: User | null;
  projects: Project[];
  agents: Agent[];
  opportunities: Opportunity[];
  notifications: Notification[];
  isAuthenticated: boolean;
  sidebarOpen: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: mockUser,
  projects: mockProjects,
  agents: mockAgents,
  opportunities: mockOpportunities,
  notifications: mockNotifications,
  isAuthenticated: true,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  login: () => set({ isAuthenticated: true, user: mockUser }),
  logout: () => set({ isAuthenticated: false, user: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
