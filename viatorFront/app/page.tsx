"use client";

import { useState } from "react";
import { useEmpresas } from "@/hooks/use-Empresas"
import { MapPin } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { CategoryPills } from "@/components/category-pills";
import { BusinessCard } from "@/components/business-card";
import { categories, getBusinessesByCategory } from "@/lib/data";

export default function HomePage() {
  const { empresas, isLoading, error, refetch } = useEmpresas();
  const [activeCategory, setActiveCategory] = useState("all");
  const businesses = getBusinessesByCategory(activeCategory);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}<button onClick={refetch}>Reintentar</button></div>;

  return (
    <div className="min-h-screen bg-dark-blue">
      <DesktopSidebar />

      <main className="pb-20 md:pb-8 md:ml-64">
        {/* Header */}
        <header className="px-5 pt-6 pb-4 md:px-8 md:pt-8">
          <div className="flex items-center gap-3 mb-6 md:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-action-green">
              <MapPin className="h-5 w-5 text-dark-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-very-light-beige">
                Viator
              </h1>
              <p className="text-xs text-light-beige">Descubre Tu Ciudad</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-very-light-beige mb-4 md:text-2xl">
            Explora lugares increíbles
          </h2>

          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </header>

        {/* Recommendations Section */}
        <section className="px-5 md:px-8">
          <h3 className="text-lg font-semibold text-very-light-beige mb-4">
            Nuestra recomendación
          </h3>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {empresas.map((empresa) => (
              <BusinessCard key={empresa.id} business={empresa} />
            ))}
          </div>

          {businesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light-beige">
                No hay resultados para esta categoría.
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
