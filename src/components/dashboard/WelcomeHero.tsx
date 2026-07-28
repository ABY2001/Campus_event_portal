import { StatsCard } from "@/components/dashboard/StatsCard";
import type { DashboardStat, StudentProfile } from "@/types/dashboard";

type WelcomeHeroProps = {
  profile: StudentProfile;
  stats: DashboardStat[];
};

export function WelcomeHero({ profile, stats }: WelcomeHeroProps) {
  return (
    <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)] p-6 text-white shadow-[0_24px_70px_-38px_rgba(15,23,42,0.7)] sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr] xl:items-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-sky-100">
            Student View
          </span>
          <div className="space-y-3">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Welcome back, {profile.name}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              {profile.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
