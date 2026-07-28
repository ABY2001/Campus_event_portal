export type DashboardStat = {
  id: string;
  label: string;
  value: string | number;
};

export type CategoryFilter = {
  id: string;
  label: string;
};

export type EventItem = {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  location: string;
  availableSeats: number;
  badge: "Available" | "Full";
  bannerImage: string;
};

export type RegistrationStatus = "Confirmed" | "Pending";

export type RegistrationItem = {
  id: string;
  eventName: string;
  date: string;
  status: RegistrationStatus;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  badge?: string;
  time?: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  role: string;
  department: string;
  year: string;
  email: string;
  avatarFallback: string;
  summary: string;
};
