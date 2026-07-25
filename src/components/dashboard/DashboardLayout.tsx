import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { CategoryFilterChips } from "@/components/dashboard/CategoryFilterChips";
import { EventCard } from "@/components/dashboard/EventCard";
import { Navbar } from "@/components/dashboard/Navbar";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import type {
  Announcement,
  CategoryFilter,
  DashboardStat,
  EventItem,
  RegistrationItem,
  StudentProfile,
} from "@/types/dashboard";

type DashboardLayoutProps = {
  announcements: Announcement[];
  categories: CategoryFilter[];
  events: EventItem[];
  onLogout?: () => void;
  profile: StudentProfile;
  registrations: RegistrationItem[];
  stats: DashboardStat[];
};

export function DashboardLayout({
  announcements,
  categories,
  events,
  onLogout,
  profile,
  registrations,
  stats,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950">
      <div className="flex min-h-screen w-full overflow-hidden bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <Sidebar onLogout={onLogout} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onLogout={onLogout} profile={profile} />

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7">
            <div className="space-y-6">
              <WelcomeHero profile={profile} stats={stats} />

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <CategoryFilterChips categories={categories} />
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        Upcoming Events
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Browse and register for upcoming campus events.
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                      Student Actions
                    </span>
                  </div>

                  <div className="grid gap-5">
                    {events.map((event) => (
                      <EventCard event={event} key={event.id} />
                    ))}
                  </div>
                </section>

                <div className="space-y-6">
                  <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-slate-950">
                        My Registrations
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Track confirmed and pending event requests.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {registrations.map((registration) => (
                        <RegistrationCard
                          key={registration.id}
                          registration={registration}
                        />
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-slate-950">
                        Recent Announcements
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Latest updates from the event management team.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <AnnouncementCard
                          announcement={announcement}
                          key={announcement.id}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
