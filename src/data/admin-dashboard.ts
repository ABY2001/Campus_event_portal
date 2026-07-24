import type { DashboardStat, EventItem } from "@/types/dashboard";

export const adminStats: DashboardStat[] = [
  { id: "users", label: "Total Users", value: 1248 },
  { id: "live-events", label: "Live Events", value: 24 },
  { id: "registrations", label: "Registrations", value: 892 },
  { id: "approvals", label: "Pending Approvals", value: 16 },
];

export const adminUpcomingEvents: EventItem[] = [
  {
    id: "admin-tech-talk",
    name: "Tech Talk 2026",
    category: "Workshop",
    date: "Aug 02",
    time: "10:00 AM",
    location: "Auditorium A",
    availableSeats: 42,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "admin-music-fest",
    name: "Music Fest",
    category: "Cultural",
    date: "Aug 05",
    time: "06:30 PM",
    location: "Open Ground",
    availableSeats: 18,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "admin-ai-bootcamp",
    name: "AI Bootcamp",
    category: "Seminar",
    date: "Aug 08",
    time: "09:00 AM",
    location: "Seminar Hall",
    availableSeats: 0,
    badge: "Full",
    bannerImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "admin-sports-meet",
    name: "Sports Meet",
    category: "Sports",
    date: "Aug 10",
    time: "04:00 PM",
    location: "Sports Complex",
    availableSeats: 64,
    badge: "Available",
    bannerImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
  },
];
