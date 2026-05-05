"use client";

import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, MapPin } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";

const settingsItems = [
  {
    icon: User,
    label: "Mi perfil",
    description: "Edita tu información personal",
  },
  {
    icon: Bell,
    label: "Notificaciones",
    description: "Configura tus alertas",
  },
  {
    icon: Shield,
    label: "Privacidad",
    description: "Ajustes de privacidad y seguridad",
  },
  {
    icon: HelpCircle,
    label: "Ayuda",
    description: "Centro de ayuda y soporte",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-dark-blue">
      <DesktopSidebar />

      <main className="pb-20 md:pb-8 md:ml-64">
        {/* Header */}
        <header className="px-5 pt-6 pb-4 md:px-8 md:pt-8">
          <h1 className="text-xl font-bold text-very-light-beige mb-2 md:text-2xl">
            Ajustes
          </h1>
          <p className="text-light-beige text-sm">
            Personaliza tu experiencia
          </p>
        </header>

        {/* User Card */}
        <section className="px-5 md:px-8 mb-6">
          <div className="bg-medium-blue rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-action-green flex items-center justify-center">
                <User className="h-8 w-8 text-dark-blue" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-very-light-beige">
                  Usuario Invitado
                </h2>
                <p className="text-light-beige text-sm">
                  invitado@turismomx.com
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section className="px-5 md:px-8">
          <div className="bg-medium-blue rounded-2xl overflow-hidden divide-y divide-medium-blue-accent">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 hover:bg-dark-blue/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-dark-blue flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-light-beige" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-very-light-beige">
                    {item.label}
                  </p>
                  <p className="text-sm text-light-beige">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-light-beige" />
              </button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <section className="px-5 md:px-8 mt-6">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-medium-blue rounded-2xl text-light-beige hover:bg-medium-blue-accent transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </section>

        {/* Footer */}
        <footer className="px-5 md:px-8 mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-light-beige/60 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">TurismoMX</span>
          </div>
          <p className="text-xs text-light-beige/40">
            Versión 1.0.0 • © 2024 TurismoMX
          </p>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}
