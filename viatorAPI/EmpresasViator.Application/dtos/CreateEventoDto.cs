namespace EmpresasViator.Application.dtos;

using System.Diagnostics.CodeAnalysis;

[ExcludeFromCodeCoverage]
public class CreateEventoDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Lugar { get; set; } = string.Empty;
    public DateTime FechaEvento { get; set; }
    public decimal Precio { get; set; }
    public int CapacidadMaxima { get; set; }
    public Guid IdEmpresa { get; set; }
}
