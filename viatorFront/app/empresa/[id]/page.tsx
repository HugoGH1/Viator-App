import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { StarRating } from "@/components/star-rating";
import { ImageGallery } from "@/components/image-gallery";
import { getEmpresaById } from "@/lib/api";

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { id } = await params;

  let business;
  try {
    business = await getEmpresaById(id);
  } catch (error) {
    notFound();
  }

  // Prepara los datos para los componentes existentes
  const gallery = business.galeriaImagenes && business.galeriaImagenes.length > 0
    ? business.galeriaImagenes
    : (business.imagenPortada ? [business.imagenPortada] : ["https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]);

  return (
    <div className="min-h-screen bg-dark-blue">
      <DesktopSidebar />

      <main className="pb-28 md:pb-8 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-5 py-4 bg-dark-blue/95 backdrop-blur-sm md:px-8 md:pt-8 md:static md:bg-transparent">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-medium-blue text-very-light-beige hover:bg-medium-blue-accent transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-very-light-beige truncate">
            {business.nombre}
          </h1>
        </header>

        <div className="px-5 md:px-8 space-y-6">
          {/* Title & Rating - Desktop centered */}
          <div className="text-center space-y-3 md:py-4">
            <h2 className="text-2xl font-bold text-very-light-beige md:text-3xl">
              {business.nombre}
            </h2>
            <div className="flex justify-center">
              {/* Harcoded rating por ahora hasta que el API lo soporte */}
              <StarRating rating={4.5} size="lg" />
            </div>
            {business.categoria?.nombre && (
              <p className="text-action-green font-medium">
                {business.categoria.nombre}
              </p>
            )}
          </div>

          {/* Image Gallery */}
          <ImageGallery images={gallery} businessName={business.nombre} />

          {/* Information Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-very-light-beige">
              Información del lugar
            </h3>
            <p className="text-light-beige leading-relaxed">
              Empresa registrada con RFC: <span className="font-mono bg-dark-blue/20 px-1 py-0.5 rounded">{business.rfc}</span>.
              {/* Aquí podrías agregar una descripción larga si la añades al API */}
            </p>
            {business.telefono && (
              <div className="flex items-center gap-2 text-light-beige">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <p>{business.telefono}</p>
              </div>
            )}
          </section>

          {/* Location Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-very-light-beige">
              Ubicación
            </h3>
            <div className="flex items-start gap-2 text-light-beige">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p>{business.calle} {business.numExt} {business.numInt ? `Int. ${business.numInt}` : ''}</p>
                <p>
                  {business.colonia}, {business.ciudad}, {business.estado}. C.P. {business.codigoPostal}
                </p>
              </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className="block relative aspect-video rounded-2xl overflow-hidden hover:ring-2 hover:ring-action-green transition-all group bg-medium-blue flex items-center justify-center">
              <div className="text-very-light-beige/50 font-medium">
                <span>Mapa no disponible por ahora</span>
              </div>
            </div>
          </section>
        </div>

        {/* Floating Reserve Button - Mobile */}
        <div className="fixed bottom-20 left-0 right-0 px-5 md:hidden z-30">
          <button className="w-full py-4 bg-action-green text-dark-blue font-bold text-lg rounded-2xl shadow-lg hover:bg-action-green/90 active:scale-[0.98] transition-all">
            Contactar
          </button>
        </div>

        {/* Reserve Button - Desktop */}
        <div className="hidden md:block px-8 pt-6">
          <button className="w-full max-w-md mx-auto block py-4 bg-action-green text-dark-blue font-bold text-lg rounded-2xl shadow-lg hover:bg-action-green/90 active:scale-[0.98] transition-all">
            Contactar ahora
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
