import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  announcements,
  categoryFilters,
  dashboardStats,
  registeredEvents,
  studentProfile,
  upcomingEvents,
} from "@/data/dashboard";

type StudentDashboardPageProps = {
  onLogout?: () => void;
  userName?: string;
};

export function StudentDashboardPage(props: StudentDashboardPageProps) {
  return (
    <DashboardLayout
      announcements={announcements}
      categories={categoryFilters}
      events={upcomingEvents}
      onLogout={props.onLogout}
      profile={{
        ...studentProfile,
        name: props.userName ?? studentProfile.name,
      }}
      registrations={registeredEvents}
      stats={dashboardStats}
    />
  );
}
