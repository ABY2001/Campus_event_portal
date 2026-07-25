import { HiOutlineLogout } from "react-icons/hi";
import type { StudentProfile } from "@/types/dashboard";

type NavbarProps = {
  profile: StudentProfile;
  onLogout?: () => void;
};

export function Navbar({ profile, onLogout }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Campus Event Management Portal
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Student Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 min-w-[240px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 sm:min-w-[320px]">
            Search events, workshops, categories...
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
              {profile.avatarFallback || "ST"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{profile.name}</p>
              <p className="text-[10px] font-medium text-slate-500">{profile.role}</p>
            </div>
          </div>

          {/* Prominent Back to Login / Sign Out Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              title="Sign out and return to Login page"
            >
              <HiOutlineLogout className="text-base" />
              <span>Back to Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
