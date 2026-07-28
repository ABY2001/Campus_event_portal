import type { DashboardStat } from "@/types/dashboard";

type StatsCardProps = {
  stat: DashboardStat;
};

export function StatsCard({ stat }: StatsCardProps) {
  const isLongText = typeof stat.value === "string" && stat.value.length > 4;

  return (
    <div className="flex flex-col justify-between min-w-0 rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur transition hover:bg-white/15">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 truncate" title={stat.label}>
        {stat.label}
      </p>
      <p
        className={[
          "mt-2 font-semibold tracking-tight break-words",
          isLongText
            ? "text-lg sm:text-xl md:text-2xl leading-snug text-white"
            : "text-3xl sm:text-4xl text-white",
        ].join(" ")}
        title={String(stat.value)}
      >
        {stat.value}
      </p>
    </div>
  );
}
