import type { ApiRegistration } from "@/lib/api";

type RegistrationCardProps = {
  registration: ApiRegistration;
  onCancel?: (eventId: string) => void;
};

export function RegistrationCard({ registration, onCancel }: RegistrationCardProps) {
  const isConfirmed = registration.status === "REGISTERED";
  const isWaitlisted = registration.status === "WAITLISTED";

  const eventTitle = registration.event?.title || "Campus Event";
  const eventDate = registration.event?.start_time
    ? new Date(registration.event.start_time).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : new Date(registration.registered_at).toLocaleDateString();

  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{eventTitle}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {eventDate} {registration.event?.location ? `• ${registration.event.location}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold",
              isConfirmed
                ? "bg-emerald-50 text-emerald-700"
                : isWaitlisted
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-200 text-slate-700",
            ].join(" ")}
          >
            {isConfirmed ? "Confirmed" : isWaitlisted ? "Waitlisted" : registration.status}
          </span>

          {registration.event_id && isConfirmed && (
            <button
              onClick={() => onCancel?.(registration.event_id)}
              className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              title="Cancel your registration"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
