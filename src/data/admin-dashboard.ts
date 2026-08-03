import type { DashboardStat, EventItem } from "@/types/dashboard";

export const adminStats: DashboardStat[] = [
  { id: "users", label: "Total Users", value: 0 },
  { id: "live-events", label: "Live Events", value: 0 },
  { id: "registrations", label: "Registrations", value: 0 },
  { id: "approvals", label: "Pending Approvals", value: 0 },
];

export const adminUpcomingEvents: EventItem[] = [];
