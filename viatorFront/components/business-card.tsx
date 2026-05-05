import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Phone } from "lucide-react";
import type { Empresa } from "@/lib/api";

interface BusinessCardProps {
  business: Empresa;
}

export function BusinessCard({ business }: BusinessCardProps) {
  // Como la API aún no tiene imagen, usamos una por defecto para mantener el diseño
  const defaultImage = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const imageUrl = business.imagenPortada ? business.imagenPortada : defaultImage;
  return (
    <div className="bg-very-light-beige rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-video flex-shrink-0">
        <Image
          src={imageUrl}
          alt={business.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-dark-blue/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <Star className="h-3.5 w-3.5 fill-action-green text-action-green" />
          <span className="text-very-light-beige text-sm font-semibold">
            4.5
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-dark-blue mb-1 line-clamp-1">{business.nombre}</h3>

        {business.categoria?.nombre && (
          <p className="text-action-green text-sm mb-2 font-semibold">
            {business.categoria.nombre}
          </p>
        )}

        <div className="flex flex-col gap-2 mb-4 mt-2">
          <div className="flex items-start gap-1.5 text-medium-blue-accent text-xs">
            <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {business.calle} {business.numExt}{business.numInt ? ` Int. ${business.numInt}` : ''}, {business.colonia}, {business.ciudad}
            </span>
          </div>
          {business.telefono && (
            <div className="flex items-center gap-1.5 text-medium-blue-accent text-xs">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{business.telefono}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="text-[10px] text-dark-blue/60 font-mono bg-dark-blue/5 px-2 py-1 rounded-md">
            RFC: {business.rfc}
          </span>
          <Link
            href={`/empresa/${business.id}`}
            className="inline-flex items-center px-4 py-2 bg-medium-blue-accent text-very-light-beige rounded-xl text-sm font-medium hover:bg-primary transition-colors duration-200"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}
