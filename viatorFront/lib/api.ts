import ApiResponseError from "./error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface Empresa {
    id: string,
    idAdmin?: string,
    nombre: string,
    rfc: string,
    calle: string,
    numExt: string,
    numInt?: string,
    colonia: string,
    ciudad: string,
    estado: string,
    codigoPostal: string,
    telefono: string,
    fechaRegistro: string,
    idCategoria: string
    imagenPortada?: string;
    galeriaImagenes?: string[];
    categoria?: Categoria,
    eventos?: Evento[];
}

export interface Categoria {
    id: string,
    nombre: string,
    descripcion?: string;
}

export interface Evento {
    id: string,
    titulo: string,
    descripcion: string,
    lugar: string,
    fechaEvento: string,
    precio: number,
    capacidadMaxima: number,
    idEmpresa: string,

    empresa?: Empresa;
}

export async function getEmpresas(): Promise<Empresa[]> {
    const res = await fetch(`${API_URL}/api/Empresa/Empresas`);
    if (!res.ok) throw new ApiResponseError(`No se pudieron obtener las empresas: ${res.statusText}`, res.status);
    return await res.json();
}

export async function getEmpresaById(id: string): Promise<Empresa> {
    const res = await fetch(`${API_URL}/api/Empresa/${id}`);
    if (!res.ok) throw new ApiResponseError(`Empresa no encontrada: ${res.statusText}`, res.status);
    return await res.json();
}

export async function getCategorias(): Promise<Categoria[]> {
    const res = await fetch(`${API_URL}/api/Categoria/Categorias`);
    if (!res.ok) throw new ApiResponseError(`No se pudieron obtener las categorias: ${res.statusText}`, res.status);
    return await res.json();
}

export async function getEventos(): Promise<Evento[]> {
    const res = await fetch(`${API_URL}/api/Evento/GetAll`);
    if (!res.ok) throw new ApiResponseError(`No se pudieron obtener los eventos: ${res.statusText}`, res.status);
    return await res.json();
}

