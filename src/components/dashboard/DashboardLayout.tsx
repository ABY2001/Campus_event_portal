import { CategoryFilterChips } from "@/components/dashboard/CategoryFilterChips";
import { EventCard } from "@/components/dashboard/EventCard";
import { Navbar } from "@/components/dashboard/Navbar";
import { RegistrationCard } from "@/components/dashboard/RegistrationCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import type { Announcement, DashboardStat, StudentProfile } from "@/types/dashboard";
import type { ApiEvent, ApiRegistration } from "@/lib/api";

type DashboardLayoutProps = {
  announcements?: Announcement[];
  categories: { id: string; label: string }[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
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
  categories,
  selectedCategory = "All",
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
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
          <Navbar
            onLogout={onLogout}
            profile={profile}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />

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
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        Upcoming Campus Events ({events.length})
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {searchQuery
                          ? `Showing search results for "${searchQuery}"`
                          : "Browse and register for upcoming student activities, workshops, and fests."}
                      </p>
                    </div>
                    <span className="self-start rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 sm:self-auto">
                      Live Student Portal
                    </span>
                  </div>

                  {events.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      {searchQuery
                        ? `No events found matching "${searchQuery}". Try a different keyword.`
                        : "No events available in this category."}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {events.map((event) => (
                        <EventCard
                          event={event}
                          isRegistered={registeredEventIds.has(event.id)}
                          key={event.id}
                          onRegister={() => onRegisterEvent?.(event.id)}
                          onCancel={() => onCancelRegistration?.(event.id)}
                          isRegistering={actionLoadingEventId === event.id}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Right Column: Registrations */}
                <div className="space-y-6">
                  <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">
                      My Registrations ({registrations.length})
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Events you are currently enrolled in.
                    </p>

                    <div className="mt-4 space-y-3">
                      {registrations.length === 0 ? (
                        <p className="text-xs text-slate-400">No active registrations yet.</p>
                      ) : (
                        registrations.map((item) => (
                          <RegistrationCard
                            key={item.id}
                            registration={item}
                            onCancel={() => onCancelRegistration?.(item.event_id)}
                          />
                        ))
                      )}
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
