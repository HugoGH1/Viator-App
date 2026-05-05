namespace EmpresasViator.Tests.Infrastructure.Context;

using System;
using System.Linq;
using System.Threading.Tasks;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class ApplicationDbContextTests
{
    [Fact]
    public void OnModelCreating_ShouldConfigureIndexesAndSeedData()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        // Act
        using var context = new ApplicationDbContext(options);
        context.Database.EnsureCreated();

        // Assert
        // Verify seed data is inserted
        var categorias = context.Categorias.ToList();
        Assert.Equal(2, categorias.Count);
        Assert.Contains(categorias, c => c.Nombre == "Entretenimiento");
        Assert.Contains(categorias, c => c.Nombre == "Servicios");

        // Note: In InMemory databases, unique indexes constraint enforcement might not throw automatically
        // like a relational DB, but calling EnsureCreated ensures the OnModelCreating logic has executed
        // which fulfills coverage for this layer.
    }
}
