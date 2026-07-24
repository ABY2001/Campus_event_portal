export function SocialAuthButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        type="button"
      >
        Continue with Google
      </button>
      <button
        className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        type="button"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
