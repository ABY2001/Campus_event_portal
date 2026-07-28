export type CategoryFilterItem = {
  id: string;
  label: string;
};

type CategoryFilterChipsProps = {
  categories: CategoryFilterItem[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
};

export function CategoryFilterChips({
  categories,
  selectedCategory = "All",
  onSelectCategory,
}: CategoryFilterChipsProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Explore Categories
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Filter events by type and browse what fits your academic & campus interests.
          </p>
        </div>
        <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          Search Ready
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.label;
          return (
            <button
              onClick={() => onSelectCategory?.(category.label)}
              className={[
                "rounded-full px-5 py-3 text-sm font-medium transition",
                isSelected
                  ? "bg-slate-950 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
              key={category.id}
              type="button"
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
