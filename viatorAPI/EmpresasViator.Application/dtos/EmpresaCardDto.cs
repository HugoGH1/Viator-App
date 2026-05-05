namespace EmpresasViator.Application.dtos;

public record EmpresaCardDto(
    Guid Id,
    string Nombre,
    string RFC,
    string Ciudad,
    string Categoria,
    string Calle,
    string NumExt,
    string NumInt,
    string Colonia,
    string CodigoPostal,
    string Estado,
    string Telefono,
    string? ImagenPortada,
    List<string> GaleriaImagenes
);