'use client';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const tabs = [
    { id: 'all', label: 'All Pickles 🌶️' },
    { id: 'veg', label: 'Veg Pickles 🌿' },
    { id: 'nonveg', label: 'Non-Veg Pickles 🍖' },
  ];

  return (
    <div className="flex justify-center my-8">
      <div className="inline-flex bg-bg-cream-dark p-1 rounded-full border border-border-warm shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[44px] ${
                isActive
                  ? 'bg-primary-red text-white shadow-md'
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
