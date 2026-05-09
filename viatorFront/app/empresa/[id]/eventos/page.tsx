"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { ChevronLeft, Calendar, Users, MapPin } from "lucide-react";
import { useEventos } from "@/hooks/use-Eventos";
import { type Evento } from "@/lib/api";
import EventTicketModal from "@/components/event-ticket-modal";

interface EventosPageProps {
  params: Promise<{ id: string }>;
}

export default function EventosPage({ params }: EventosPageProps) {
  const { id } = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const { eventos, isLoading, error } = useEventos(id);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  if (authLoading || (!user && !authLoading)) return <div className="min-h-screen bg-dark-blue flex items-center justify-center text-light-beige">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-dark-blue">
      <DesktopSidebar />

      <main className="pb-20 md:pb-8 md:ml-64">
        <header className="px-5 pt-6 pb-4 md:px-8 md:pt-8 bg-dark-blue sticky top-0 z-20">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-medium-blue text-very-light-beige hover:bg-medium-blue-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-very-light-beige">
              Cartelera de Eventos
            </h1>
          </div>
        </header>

        <section className="px-5 md:px-8 mt-2 space-y-6">
          {isLoading && (
            <div className="text-light-beige text-center py-12">Cargando eventos...</div>
          )}

          {error && (
            <div className="text-red-400 text-center py-12">
              Error al cargar los eventos: {error}
            </div>
          )}

          {!isLoading && !error && eventos.length === 0 && (
            <div className="text-center py-16 bg-medium-blue/30 rounded-2xl border border-medium-blue">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-very-light-beige font-medium text-lg">No hay eventos próximos</p>
              <p className="text-light-beige text-sm mt-1">Esta empresa no tiene eventos programados por ahora.</p>
            </div>
          )}

          {!isLoading && !error && eventos.map((evento) => {
            const eventDate = new Date(evento.fechaEvento);
            const timeStr = eventDate.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={evento.id} className="bg-medium-blue rounded-3xl p-5 shadow-lg border border-white/5 hover:border-action-green/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-very-light-beige leading-tight">
                      {evento.titulo}
                    </h2>
                    <p className="text-action-green font-semibold mt-1 text-lg">
                      ${evento.precio} MXN
                    </p>
                  </div>
                  <div className="bg-dark-blue rounded-xl p-3 flex flex-col items-center justify-center min-w-[70px] border border-white/10">
                    <span className="text-xs text-light-beige font-medium uppercase tracking-wider">{eventDate.toLocaleDateString("es-MX", { month: "short" })}</span>
                    <span className="text-2xl font-black text-very-light-beige">{eventDate.getDate()}</span>
                  </div>
                </div>

                <p className="text-light-beige text-sm mb-5 leading-relaxed">
                  {evento.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2 text-very-light-beige text-sm bg-dark-blue/50 p-2.5 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{evento.lugar}</span>
                  </div>
                  <div className="flex items-center gap-2 text-very-light-beige text-sm bg-dark-blue/50 p-2.5 rounded-xl">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-very-light-beige text-sm bg-dark-blue/50 p-2.5 rounded-xl col-span-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Capacidad Máx: {evento.capacidadMaxima} personas</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvento(evento)}
                  className="w-full py-3.5 bg-action-green text-dark-blue font-bold rounded-xl hover:bg-action-green/90 active:scale-[0.98] transition-all">
                  Reservar Boletos
                </button>
              </div>
            );
          })}
        </section>
      </main>

      <EventTicketModal evento={selectedEvento} onClose={() => setSelectedEvento(null)} />

      <BottomNav />
    </div>
  );
}
