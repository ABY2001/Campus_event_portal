import type { RegistrationItem } from "@/types/dashboard";

type RegistrationCardProps = {
  registration: RegistrationItem;
};

export function RegistrationCard({ registration }: RegistrationCardProps) {
  return (
    <article className="rounded-[24px] bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">
            {registration.eventName}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{registration.date}</p>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-sm font-medium",
            registration.status === "Confirmed"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {registration.status}
        </span>
      </div>
    </article>
  );
}
