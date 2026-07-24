import type { EventItem } from "@/types/dashboard";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm">
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.bannerImage})` }}
      />
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">{event.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{event.category}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={[
                "rounded-full px-3 py-1 text-sm font-medium",
                event.badge === "Available"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              {event.badge}
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
              {event.availableSeats > 0
                ? `${event.availableSeats} seats left`
                : "No seats left"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
            {event.date}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
            {event.time}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
            {event.location}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            type="button"
          >
            Register
          </button>
          <button
            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            type="button"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
