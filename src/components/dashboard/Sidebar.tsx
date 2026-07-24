type SidebarProps = {
  onLogout?: () => void;
};

const navItems = [
  "Dashboard",
  "Events",
  "My Registrations",
  "Profile",
  "Settings",
];

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="hidden w-24 flex-col justify-between bg-slate-950 px-4 py-7 text-white lg:flex">
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-xl font-semibold">
            CE
          </div>
        </div>

        <nav className="space-y-4">
          {navItems.map((item, index) => (
            <button
              className={[
                "mx-auto flex h-14 w-14 items-center justify-center rounded-3xl text-[11px] font-medium transition",
                index === 0
                  ? "bg-white text-slate-950"
                  : "bg-white/10 text-white hover:bg-white/20",
              ].join(" ")}
              key={item}
              type="button"
              title={item}
            >
              {item.slice(0, 2)}
            </button>
          ))}
        </nav>
      </div>

      <button
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-[11px] font-medium text-white transition hover:bg-white/20"
        type="button"
        onClick={onLogout}
        title="Logout"
      >
        LO
      </button>
    </aside>
  );
}
