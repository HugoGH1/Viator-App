"use client";

import Image from "next/image";
import { type Evento } from "@/lib/api";

interface Props {
    evento: Evento | null;
    onClose: () => void;
}

export default function EventTicketModal({
    evento,
    onClose,
}: Props) {
    if (!evento) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-medium-blue w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                <div className="bg-action-green p-4 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-dark-blue hover:text-dark-blue/70 transition-colors"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-black text-dark-blue uppercase tracking-widest mt-2">
                        Boleto Confirmado
                    </h3>
                </div>

                <div className="p-6 bg-very-light-beige flex flex-col items-center">
                    <p className="text-dark-blue font-bold text-center text-lg leading-tight mb-1">
                        {evento.titulo}
                    </p>

                    <p className="text-slate-500 text-sm mb-6 text-center">
                        {new Date(evento.fechaEvento).toLocaleDateString("es-MX", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}{" "}
                        a las{" "}
                        {new Date(evento.fechaEvento).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6">
                        <Image
                            src="https://www.imgonline.com.ua/examples/qr-code-url.png"
                            alt="QR"
                            width={192}
                            height={192}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="w-full border-t-2 border-dashed border-slate-300 my-2 relative">
                        <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 rounded-full"></div>
                        <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 rounded-full"></div>
                    </div>

                    <div className="w-full flex justify-between items-center mt-4">
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                                Lugar
                            </p>

                            <p className="text-dark-blue font-bold text-sm truncate max-w-[150px]">
                                {evento.lugar}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                                Precio
                            </p>

                            <p className="text-dark-blue font-black text-lg">
                                ${evento.precio}
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-400 text-xs text-center mt-6">
                        Muestra este código QR en la entrada del evento.
                    </p>
                </div>
            </div>
        </div>
    );
}