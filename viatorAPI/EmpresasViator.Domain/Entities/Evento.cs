using System.ComponentModel.DataAnnotations.Schema;
namespace EmpresasViator.Domain.Entities;

public class Evento
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Lugar { get; set; } = string.Empty;
    public DateTime FechaEvento { get; set; }
    public decimal Precio { get; set; }
    public int CapacidadMaxima { get; set; }

    [ForeignKey("Empresa")]
    public Guid IdEmpresa { get; set; }
    public Empresa Empresa { get; set; } = null!;
}