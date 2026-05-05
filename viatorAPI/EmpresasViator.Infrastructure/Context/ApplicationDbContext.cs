using Microsoft.EntityFrameworkCore;
using EmpresasViator.Domain.Entities;
using System.ComponentModel;

namespace EmpresasViator.Infrastructure.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Empresa> Empresas { get; set; }
    public DbSet<Evento> Eventos { get; set; }
    public DbSet<Categoria> Categorias { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Empresa>()
            .HasIndex(e => e.RFC)
            .IsUnique();

        modelBuilder.Entity<Evento>()
            .HasIndex(e => new { e.Lugar, e.FechaEvento })
            .IsUnique();

        modelBuilder.Entity<Categoria>().HasData(
            new Categoria
            {
                Id = Guid.Parse("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
                Nombre = "Entretenimiento",
                Descripcion = "Establecimientos de eventos"
            },
            new Categoria
            {
                Id = Guid.Parse("550e8400-e29b-41d4-a716-446655440000"),
                Nombre = "Servicios",
                Descripcion = "Servicios de venta de productos"
            }
        );
    }
}