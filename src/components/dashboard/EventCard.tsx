import type { ApiEvent } from "@/lib/api";

type EventCardProps = {
  event: ApiEvent;
  isRegistered?: boolean;
  isRegistering?: boolean;
  onRegister?: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
};

export function EventCard({
  event,
  isRegistered = false,
  isRegistering = false,
  onRegister,
  onCancel,
}: EventCardProps) {
  const isFull = event.available_seats <= 0;
  const isCancelled = event.status === "CANCELLED";

  const formattedDate = new Date(event.start_time).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bannerSrc = event.banner_url
    ? event.banner_url.startsWith("http") || event.banner_url.startsWith("blob")
      ? event.banner_url
      : `http://localhost:8000${event.banner_url}`
    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60";

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm transition hover:shadow-md">
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerSrc})` }}
      />
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {event.category}
            </span>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{event.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{event.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {isRegistered ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                ✓ Registered
              </span>
            ) : isFull ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Full / Waitlist
              </span>
            ) : isCancelled ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                Cancelled
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Available
              </span>
            )}

            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              {event.available_seats > 0
                ? `${event.available_seats} seats left`
                : "No seats left"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-medium text-slate-700 border border-slate-200">
            {formattedDate}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-medium text-slate-700 border border-slate-200">
            {formattedTime}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-medium text-slate-700 border border-slate-200">
            {event.location}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
          <div className="text-xs text-slate-500">
            Capacity: <strong>{event.registered_count} / {event.capacity}</strong> students registered
          </div>

          <div className="flex flex-wrap gap-2">
            {isRegistered ? (
              <button
                onClick={() => onCancel?.(event.id)}
                disabled={isRegistering}
                className="h-11 rounded-2xl border border-red-200 bg-red-50 px-5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                type="button"
              >
                {isRegistering ? "Cancelling..." : "Cancel Registration"}
              </button>
            ) : (
              <button
                onClick={() => onRegister?.(event.id)}
                disabled={isRegistering || isCancelled}
                className="h-11 rounded-2xl bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                type="button"
              >
                {isRegistering ? "Registering..." : isFull ? "Join Waitlist" : "Register Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
