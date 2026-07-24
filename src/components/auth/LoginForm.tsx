type LoginFormProps = {
  onSelectAdmin?: () => void;
  onSelectStudent?: () => void;
};

export function LoginForm({ onSelectAdmin, onSelectStudent }: LoginFormProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          className="rounded-[28px] border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
          type="button"
          onClick={onSelectStudent}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            ST
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-950">
            Open Student Dashboard
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Browse events, register instantly, and track confirmations from a
            clean student portal.
          </p>
          <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            No login required
          </span>
        </button>

        <button
          className="rounded-[28px] border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
          type="button"
          onClick={onSelectAdmin}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            AD
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-950">
            Open Admin Dashboard
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage events, view registrations, and monitor campus activity from
            the admin workspace.
          </p>
          <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Demo access enabled
          </span>
        </button>
      </div>

      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-500">
        This login screen is intentionally auth-free for UI development. Each
        button routes directly to its matching dashboard.
      </div>
    </div>
  );
}
