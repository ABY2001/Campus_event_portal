import type { Announcement } from "@/types/dashboard";

type AnnouncementCardProps = {
  announcement: Announcement;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {announcement.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {announcement.description}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
          {announcement.date}
        </span>
      </div>
    </article>
  );
}
