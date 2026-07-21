'use client';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const tabs = [
    { id: 'all', label: 'All Pickles 🌶#' },
    { id: 'veg', label: 'Veg Pickles 🌿' },
    { id: 'nonveg', label: 'Non-Veg Pickles 🍖' },
    { id: 'podulu', label: 'Podulu 🥣' },
    { id: 'seeds', label: 'Seeds 🌻' },
    { id: 'jellies', label: 'Jellies 🍬' },
  ];

  return (
    <div className="flex justify-center my-6 max-w-full">
      <div className="flex items-center gap-1.5 bg-bg-cream-dark p-1 rounded-full border border-border-warm shadow-inner overflow-x-auto max-w-full scrollbar-none snap-x whitespace-nowrap scroll-smooth px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[38px] snap-center ${
                isActive
                  ? 'bg-primary-red text-white shadow-md font-bold'
                  : 'text-text-charcoal hover:text-primary-red hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
