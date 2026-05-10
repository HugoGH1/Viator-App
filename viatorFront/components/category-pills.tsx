"use client";

import { cn } from "@/lib/utils";
import { Utensils, Theater, Cake, Landmark, LayoutGrid } from "lucide-react";
import type { Categoria } from "@/lib/api";

interface CategoryPillsProps {
  categories: Categoria[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  const allCategories = [{ id: "all", nombre: "Todos" } as Categoria, ...categories];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map((category) => {
        const isActive = activeCategory === category.id;
        // Mapeo básico: si tuviéramos un icono en BD lo usaríamos, sino usamos uno genérico
        const IconComponent = category.id === "all" ? LayoutGrid : LayoutGrid;

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
            {category.nombre}
          </button>
        );
      })}
    </div>
  );
}
