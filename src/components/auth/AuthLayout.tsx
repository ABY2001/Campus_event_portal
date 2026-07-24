import type { PropsWithChildren } from "react";

type AuthLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export function AuthLayout({ children, description, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950">
      <div className="grid min-h-screen w-full overflow-hidden bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_38%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold tracking-[0.24em]">
              CE
            </div>
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-slate-100">
                Campus Event Portal
              </span>
              <h2 className="max-w-md text-4xl font-semibold leading-tight">
                Discover, register, and manage student events from one place.
              </h2>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                A modern campus portal for workshops, hackathons, cultural
                programs, seminars, and sports events.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Live events</p>
              <p className="mt-2 text-3xl font-semibold">24</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Registrations</p>
              <p className="mt-2 text-3xl font-semibold">892</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Upcoming this week</p>
              <p className="mt-2 text-3xl font-semibold">7</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-xl space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Student Access
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h1>
                <p className="text-sm leading-6 text-slate-500">{description}</p>
              </div>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
