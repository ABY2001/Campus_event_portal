import { CategoryFilterChips } from "@/components/dashboard/CategoryFilterChips";
import { EventCard } from "@/components/dashboard/EventCard";
import { Navbar } from "@/components/dashboard/Navbar";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import type { Announcement, DashboardStat, StudentProfile } from "@/types/dashboard";
import type { ApiEvent, ApiRegistration } from "@/lib/api";

type DashboardLayoutProps = {
  announcements: Announcement[];
  categories: { id: string; label: string }[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  events: ApiEvent[];
  onLogout?: () => void;
  profile: StudentProfile;
  registrations: ApiRegistration[];
  stats: DashboardStat[];
  onRegisterEvent?: (eventId: string) => void;
  onCancelRegistration?: (eventId: string) => void;
  actionLoadingEventId?: string | null;
  feedbackMsg?: string | null;
  onDismissFeedback?: () => void;
};

export function DashboardLayout({
  announcements,
  categories,
  selectedCategory = "All",
  onSelectCategory,
  events,
  onLogout,
  profile,
  registrations,
  stats,
  onRegisterEvent,
  onCancelRegistration,
  actionLoadingEventId,
  feedbackMsg,
  onDismissFeedback,
}: DashboardLayoutProps) {
  // Compute registered event IDs set for quick lookup
  const registeredEventIds = new Set(
    registrations
      .filter((r) => r.status === "REGISTERED" || r.status === "WAITLISTED")
      .map((r) => r.event_id)
  );

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950">
      <div className="flex min-h-screen w-full overflow-hidden bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <Sidebar onLogout={onLogout} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onLogout={onLogout} profile={profile} />

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7">
            <div className="space-y-6">
              {/* Feedback Banner Notification */}
              {feedbackMsg && (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">✓</span>
                    {feedbackMsg}
                  </span>
                  <button
                    onClick={onDismissFeedback}
                    className="ml-4 rounded-lg p-1 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                    title="Dismiss notification"
                  >
                    ✕
                  </button>
                </div>
              )}

              <WelcomeHero profile={profile} stats={stats} />

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <CategoryFilterChips
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={onSelectCategory}
                />
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                {/* Events Discovery Section */}
                <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        Upcoming Campus Events ({events.length})
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Browse and register for upcoming student activities, workshops, and fests.
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                      Live Student Portal
                    </span>
                  </div>

                  {events.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      No events found in this category. Check back soon!
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {events.map((event) => (
                        <EventCard
                          event={event}
                          isRegistered={registeredEventIds.has(event.id)}
                          isRegistering={actionLoadingEventId === event.id}
                          key={event.id}
                          onRegister={onRegisterEvent}
                          onCancel={onCancelRegistration}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Sidebar Column: My Registrations & Announcements */}
                <div className="space-y-6">
                  <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-slate-950">
                        My Registrations ({registrations.filter((r) => r.status !== "CANCELLED").length})
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Track confirmed and pending event registrations.
                      </p>
                    </div>

                    {registrations.filter((r) => r.status !== "CANCELLED").length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                        You have not registered for any events yet. Click "Register Now" on any event above!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registrations
                          .filter((r) => r.status !== "CANCELLED")
                          .map((registration) => (
                            <RegistrationCard
                              key={registration.id}
                              registration={registration}
                              onCancel={onCancelRegistration}
                            />
                          ))}
                      </div>
                    )}
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
                        <div key={announcement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                              {announcement.badge}
                            </span>
                            <span className="text-[10px] text-slate-400">{announcement.time}</span>
                          </div>
                          <h4 className="mt-2 text-sm font-semibold text-slate-950">{announcement.title}</h4>
                          <p className="mt-1 text-xs text-slate-500">{announcement.description}</p>
                        </div>
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
