"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Settings, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/buscar", icon: Search, label: "Buscar" },
  { href: "/ajustes", icon: Settings, label: "Ajustes" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-medium-blue border-r border-medium-blue-accent">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-medium-blue-accent">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-action-green">
          <MapPin className="h-5 w-5 text-dark-blue" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-very-light-beige">Viator</h1>
          <p className="text-xs text-light-beige">Descubre Tu Ciudad</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-light-beige text-dark-blue"
                      : "text-very-light-beige hover:bg-dark-blue/50"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-6 border-t border-medium-blue-accent">
        <p className="text-xs text-muted-foreground text-center">
          © 2024 TurismoMX
        </p>
      </div>
    </aside>
  );
}
