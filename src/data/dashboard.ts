import type {
  Announcement,
  CategoryFilter,
  DashboardStat,
  EventItem,
  RegistrationItem,
  StudentProfile,
} from "@/types/dashboard";

export const studentProfile: StudentProfile = {
  id: "student-1",
  name: "Campus Student",
  role: "Student",
  department: "Computer Science",
  year: "Final Year",
  email: "student@campus.edu",
  avatarFallback: "CS",
  summary:
    "Discover upcoming events, register instantly, and track your registrations from one place.",
};

export const dashboardStats: DashboardStat[] = [
  { id: "registered", label: "Registered Events", value: 0 },
  { id: "upcoming", label: "Upcoming Events", value: 0 },
  { id: "completed", label: "Completed Events", value: 0 },
];

export const categoryFilters: CategoryFilter[] = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshop" },
  { id: "cultural", label: "Cultural" },
  { id: "sports", label: "Sports" },
  { id: "seminar", label: "Seminar" },
  { id: "academic", label: "Academic" },
  { id: "hackathon", label: "Hackathon" },
];

export const upcomingEvents: EventItem[] = [];

export const registeredEvents: RegistrationItem[] = [];

export const announcements: Announcement[] = [];
