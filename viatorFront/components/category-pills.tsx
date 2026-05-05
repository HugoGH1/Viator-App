"use client";

import { cn } from "@/lib/utils";
import { Utensils, Theater, Cake, Landmark, LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  theater: Theater,
  cake: Cake,
  landmark: Landmark,
};

interface CategoryPillsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  const allCategories = [{ id: "all", name: "Todos", icon: "grid" }, ...categories];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map((category) => {
        const isActive = activeCategory === category.id;
        const IconComponent = category.id === "all" ? LayoutGrid : iconMap[category.icon] || LayoutGrid;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-sm",
              isActive
                ? "bg-light-beige text-dark-blue shadow-md"
                : "bg-medium-blue text-very-light-beige hover:bg-medium-blue-accent"
            )}
          >
            <IconComponent className="h-4 w-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
