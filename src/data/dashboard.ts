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
  name: "Aby Ponnachan",
  role: "Student",
  department: "Computer Science",
  year: "Final Year",
  email: "aby@example.com",
  avatarFallback: "AP",
  summary:
    "Discover upcoming events, register instantly, and track your registrations from one place.",
};

export const dashboardStats: DashboardStat[] = [
  { id: "registered", label: "Registered Events", value: 12 },
  { id: "upcoming", label: "Upcoming Events", value: 4 },
  { id: "completed", label: "Completed Events", value: 8 },
];

export const categoryFilters: CategoryFilter[] = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshop" },
  { id: "cultural", label: "Cultural" },
  { id: "sports", label: "Sports" },
  { id: "seminar", label: "Seminar" },
  { id: "hackathon", label: "Hackathon" },
];

export const upcomingEvents: EventItem[] = [
  {
    id: "tech-talk-2026",
    name: "Tech Talk 2026",
    category: "Workshop",
    date: "2026-08-02",
    time: "10:00 AM",
    location: "Auditorium A",
    availableSeats: 42,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "music-fest",
    name: "Music Fest",
    category: "Cultural",
    date: "2026-08-05",
    time: "06:30 PM",
    location: "Open Ground",
    availableSeats: 18,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ai-bootcamp",
    name: "AI Bootcamp",
    category: "Seminar",
    date: "2026-08-08",
    time: "09:00 AM",
    location: "Seminar Hall",
    availableSeats: 0,
    badge: "Full",
    bannerImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sports-meet",
    name: "Sports Meet",
    category: "Sports",
    date: "2026-08-10",
    time: "04:00 PM",
    location: "Sports Complex",
    availableSeats: 64,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const registeredEvents: RegistrationItem[] = [
  {
    id: "registration-1",
    eventName: "Music Fest",
    date: "2026-08-05",
    status: "Confirmed",
  },
  {
    id: "registration-2",
    eventName: "AI Bootcamp",
    date: "2026-08-08",
    status: "Pending",
  },
  {
    id: "registration-3",
    eventName: "Sports Meet",
    date: "2026-08-10",
    status: "Confirmed",
  },
];

export const announcements: Announcement[] = [
  {
    id: "announcement-1",
    title: "Registration deadlines updated",
    description: "Workshop registrations now close 24 hours before the event start time.",
    date: "2026-07-20",
  },
  {
    id: "announcement-2",
    title: "Student volunteers needed",
    description: "The cultural committee is inviting volunteers for August campus events.",
    date: "2026-07-22",
  },
];
