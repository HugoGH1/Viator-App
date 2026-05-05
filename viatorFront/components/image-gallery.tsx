"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  businessName: string;
}

export function ImageGallery({ images, businessName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image - Mobile Carousel */}
      <div className="relative aspect-video rounded-2xl overflow-hidden md:hidden">
        <Image
          src={images[activeIndex]}
          alt={`${businessName} - Imagen ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-dark-blue/60 backdrop-blur-sm rounded-full text-very-light-beige hover:bg-dark-blue/80 transition-colors"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-dark-blue/60 backdrop-blur-sm rounded-full text-very-light-beige hover:bg-dark-blue/80 transition-colors"
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === activeIndex
                  ? "bg-action-green w-6"
                  : "bg-very-light-beige/50 hover:bg-very-light-beige/70"
              )}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-action-green transition-all",
              index === 0 && "col-span-2 aspect-video",
              index !== 0 && "aspect-square"
            )}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={image}
              alt={`${businessName} - Imagen ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
