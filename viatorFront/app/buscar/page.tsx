"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { BusinessCard } from "@/components/business-card";
import { useEmpresas } from "@/hooks/use-Empresas";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const { empresas, isLoading: empresasLoading } = useEmpresas();

  const filteredBusinesses = useMemo(() => {
    if (!query.trim()) return empresas;

    const lowerQuery = query.toLowerCase();
    return empresas.filter(
      (business) =>
        (business.nombre && business.nombre.toLowerCase().includes(lowerQuery)) ||
        (business.colonia && business.colonia.toLowerCase().includes(lowerQuery)) ||
        (business.ciudad && business.ciudad.toLowerCase().includes(lowerQuery))
    );
  }, [query, empresas]);

  if (authLoading || (!user && !authLoading)) return <div className="min-h-screen bg-dark-blue flex items-center justify-center text-light-beige">Cargando sesión...</div>;
  if (empresasLoading) return <div className="min-h-screen bg-dark-blue flex items-center justify-center text-light-beige">Cargando lugares...</div>;

  return (
    <div className="min-h-screen bg-dark-blue">
      <DesktopSidebar />

      <main className="pb-20 md:pb-8 md:ml-64">
        {/* Header */}
        <header className="px-5 pt-6 pb-4 md:px-8 md:pt-8">
          <h1 className="text-xl font-bold text-very-light-beige mb-4 md:text-2xl">
            Buscar lugares
          </h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light-beige" />
            <input
              type="text"
              placeholder="Buscar restaurantes, teatros, postres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-medium-blue text-very-light-beige placeholder:text-light-beige/60 rounded-xl border border-medium-blue-accent focus:border-light-beige focus:outline-none transition-colors"
            />
          </div>
        </header>

        {/* Results */}
        <section className="px-5 md:px-8">
          <p className="text-sm text-light-beige mb-4">
            {filteredBusinesses.length} resultado
            {filteredBusinesses.length !== 1 ? "s" : ""} encontrado
            {filteredBusinesses.length !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light-beige">
                No se encontraron lugares que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
