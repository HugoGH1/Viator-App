namespace EmpresasViator.Application.dtos;

using System.Diagnostics.CodeAnalysis;

[ExcludeFromCodeCoverage]
public class CreateEmpresaDto
{
    public Guid Id { get; set; }
    public string? idAdmin { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string RFC { get; set; } = string.Empty;
    public string Calle { get; set; } = string.Empty;
    public string NumExt { get; set; } = string.Empty;
    public string? NumInt { get; set; }
    public string Colonia { get; set; } = string.Empty;
    public string Ciudad { get; set; } = "Durango";
    public string Estado { get; set; } = "Durango";
    public string CodigoPostal { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string? ImagenPortada { get; set; }
    public List<string> GaleriaImagenes { get; set; } = new List<string>();
    public DateTime FechaRegistro { get; set; }
    public Guid idCategoria { get; set; }
}
