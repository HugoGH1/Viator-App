namespace EmpresasViator.Application.Mappers;

using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;

public static class EmpresaMapper
{
    public static Empresa ToEntity(this CreateEmpresaDto dto)
    {
        return new Empresa
        {
            Id = Guid.NewGuid(),
            idAdmin = dto.idAdmin,
            Nombre = dto.Nombre,
            RFC = dto.RFC,
            Calle = dto.Calle,
            NumExt = dto.NumExt,
            NumInt = dto.NumInt,
            Colonia = dto.Colonia,
            Ciudad = string.IsNullOrWhiteSpace(dto.Ciudad) ? "Durango" : dto.Ciudad,
            Estado = string.IsNullOrWhiteSpace(dto.Estado) ? "Durango" : dto.Estado,
            CodigoPostal = dto.CodigoPostal,
            Telefono = dto.Telefono,
            ImagenPortada = dto.ImagenPortada,
            GaleriaImagenes = dto.GaleriaImagenes,
            FechaRegistro = DateTime.UtcNow,
            idCategoria = dto.idCategoria
        };
    }

    public static EmpresaCardDto ToCardDto(this Empresa empresa)
    {
        return new EmpresaCardDto(
            empresa.Id,
            empresa.Nombre,
            empresa.RFC,
            empresa.Ciudad ?? "Durango",
            empresa.Categoria.Nombre,
            empresa.Calle,
            empresa.NumExt,
            empresa.NumInt,
            empresa.Colonia,
            empresa.CodigoPostal,
            empresa.Estado,
            empresa.Telefono,
            empresa.ImagenPortada,
            empresa.GaleriaImagenes
        );
    }

    public static CreateEmpresaDto ToDto(this Empresa empresa)
    {
        return new CreateEmpresaDto
        {
            Id = empresa.Id,
            idAdmin = empresa.idAdmin,
            Nombre = empresa.Nombre,
            RFC = empresa.RFC,
            Calle = empresa.Calle,
            NumExt = empresa.NumExt,
            NumInt = empresa.NumInt,
            Colonia = empresa.Colonia,
            Ciudad = empresa.Ciudad ?? "Durango",
            Estado = empresa.Estado ?? "Durango",
            CodigoPostal = empresa.CodigoPostal,
            Telefono = empresa.Telefono,
            ImagenPortada = empresa.ImagenPortada,
            GaleriaImagenes = empresa.GaleriaImagenes,
            FechaRegistro = empresa.FechaRegistro,
            idCategoria = empresa.idCategoria
        };
    }

    public static void UpdateFromDto(this Empresa empresa, CreateEmpresaDto dto)
    {
        empresa.Nombre = dto.Nombre;
        empresa.RFC = dto.RFC;
        empresa.Calle = dto.Calle;
        empresa.NumExt = dto.NumExt;
        empresa.NumInt = dto.NumInt;
        empresa.Colonia = dto.Colonia;
        empresa.Ciudad = string.IsNullOrWhiteSpace(dto.Ciudad) ? empresa.Ciudad : dto.Ciudad;
        empresa.Estado = string.IsNullOrWhiteSpace(dto.Estado) ? empresa.Estado : dto.Estado;
        empresa.CodigoPostal = dto.CodigoPostal;
        empresa.Telefono = dto.Telefono;
        empresa.ImagenPortada = dto.ImagenPortada;
        empresa.GaleriaImagenes = dto.GaleriaImagenes;
        empresa.idCategoria = dto.idCategoria;
    }
}
