namespace EmpresasViator.Domain.Entities;

public class Categoria
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public ICollection<Empresa> Empresas { get; set; } = new List<Empresa>();
}