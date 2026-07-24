import type { DashboardStat } from "@/types/dashboard";

type StatsCardProps = {
  stat: DashboardStat;
};

export function StatsCard({ stat }: StatsCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
      <p className="text-sm text-slate-300">{stat.label}</p>
      <p className="mt-3 text-4xl font-semibold">{stat.value}</p>
    </div>
  );
}
