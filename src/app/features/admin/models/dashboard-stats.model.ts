export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  errorsToday: number;
}

export interface AdminSettings {
  appName: string;
  adminEmail: string;
  darkTheme: boolean;
}
