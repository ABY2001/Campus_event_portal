import type { StudentProfile } from "@/types/dashboard";

type NavbarProps = {
  profile: StudentProfile;
};

export function Navbar({ profile }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 px-4 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-slate-500">Campus Event Management Portal</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Student Dashboard
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-14 min-w-[280px] items-center rounded-[22px] border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 sm:min-w-[360px] xl:min-w-[440px]">
            Search events by name, category, location...
          </div>
          <button
            className="h-14 rounded-[22px] bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(2,6,23,0.95)]"
            type="button"
          >
            Notifications
          </button>
          <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
              {profile.avatarFallback}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{profile.name}</p>
              <p className="text-xs text-slate-500">{profile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
