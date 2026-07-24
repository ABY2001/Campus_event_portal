import { adminStats, adminUpcomingEvents } from "@/data/admin-dashboard";

type AdminDashboardPageProps = {
  onLogout?: () => void;
  userName?: string;
};

export function AdminDashboardPage({
  onLogout,
  userName = "Campus Admin",
}: AdminDashboardPageProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950">
      <div className="flex min-h-screen w-full overflow-hidden bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <aside className="hidden w-28 flex-col justify-between bg-slate-950 px-4 py-7 text-white lg:flex">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-xl font-semibold">
                CE
              </div>
            </div>

            <nav className="space-y-4">
              {["Dashboard", "Events", "Users", "Settings"].map((item, index) => (
                <button
                  className={[
                    "mx-auto flex h-14 w-14 items-center justify-center rounded-3xl text-[11px] font-medium transition",
                    index === 0
                      ? "bg-white text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/20",
                  ].join(" ")}
                  key={item}
                  title={item}
                  type="button"
                >
                  {item.slice(0, 2)}
                </button>
              ))}
            </nav>
          </div>

          <button
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-[11px] font-medium text-white transition hover:bg-white/20"
            onClick={onLogout}
            title="Back to role selection"
            type="button"
          >
            LO
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 px-4 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Campus Event Management Portal
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-14 min-w-[280px] items-center rounded-[22px] border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 sm:min-w-[360px] xl:min-w-[440px]">
                  Search events, users, registrations...
                </div>
                <button
                  className="h-14 rounded-[22px] bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(2,6,23,0.95)]"
                  type="button"
                >
                  + Create Event
                </button>
                <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {userName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7">
            <div className="space-y-6">
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {adminStats.map((stat) => (
                  <article
                    className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
                    key={stat.id}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                      {stat.label.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="mt-6 text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                  </article>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <article className="rounded-[32px] bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)] p-7 text-white shadow-[0_24px_70px_-38px_rgba(15,23,42,0.7)]">
                  <span className="inline-flex rounded-full bg-white px-4 py-1 text-sm font-medium text-sky-700">
                    Student View
                  </span>
                  <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-tight">
                    Discover and register for campus events
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                    Browse events, search by category, register in one click, and
                    manage your profile from a clean student dashboard.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      className="h-14 rounded-[22px] bg-white px-6 text-sm font-semibold text-slate-950"
                      type="button"
                    >
                      Browse Events
                    </button>
                    <button
                      className="h-14 rounded-[22px] border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white"
                      type="button"
                    >
                      My Registrations
                    </button>
                  </div>
                </article>

                <article className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
                  <span className="inline-flex rounded-full bg-violet-50 px-4 py-1 text-sm font-medium text-violet-700">
                    Admin View
                  </span>
                  <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-tight text-slate-950">
                    Manage events and participants
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
                    Create, edit, and delete events, upload banners, and monitor
                    participants from a simple admin workspace.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      className="h-14 rounded-[22px] bg-slate-950 px-6 text-sm font-semibold text-white"
                      type="button"
                    >
                      Add Event
                    </button>
                    <button
                      className="h-14 rounded-[22px] border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700"
                      type="button"
                    >
                      View Participants
                    </button>
                  </div>
                </article>
              </section>

              <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">
                      Upcoming Events
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Sorted by latest event date.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    Pagination + Search Ready
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {adminUpcomingEvents.map((event) => (
                    <article
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
                      key={event.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-950">
                            {event.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500">
                            {event.category}
                          </p>
                        </div>
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-sm font-medium",
                            event.availableSeats > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700",
                          ].join(" ")}
                        >
                          {event.availableSeats > 0
                            ? `${event.availableSeats} seats left`
                            : "Full"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                          {event.date}
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                          {event.time}
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
