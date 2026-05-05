namespace EmpresasViator.Domain.Entities;

using System.ComponentModel.DataAnnotations.Schema;
public class Empresa
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
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    [ForeignKey("Categoria")]
    public Guid idCategoria { get; set; }
    public Categoria Categoria { get; set; } = null!;
    public string? ImagenPortada { get; set; } = string.Empty;
    public List<string> GaleriaImagenes { get; set; } = new List<string>();

    //Una empresa puede tener muchos eventos
    public ICollection<Evento> Eventos { get; set; } = new List<Evento>();
}