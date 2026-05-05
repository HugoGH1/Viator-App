using EmpresasViator.Domain.Entities;

namespace EmpresasViator.Tests.Domain.Entities;

public class CategoriaTests
{
    [Fact]
    public void Categoria_ShouldSetPropertiesCorrectly()
    {
        // Act
        var categoria = new Categoria
        {
            Id = Guid.NewGuid(),
            Nombre = "Entretenimiento",
            Descripcion = "Eventos de entretenimiento en general"
        };

        // Assert
        Assert.NotEqual(Guid.Empty, categoria.Id);
        Assert.Equal("Entretenimiento", categoria.Nombre);
        Assert.Equal("Eventos de entretenimiento en general", categoria.Descripcion);
    }

    [Fact]
    public void Categoria_ShouldInitializeCollections()
    {
        // Act
        var categoria = new Categoria();

        // Assert
        Assert.NotNull(categoria.Empresas);
        Assert.Empty(categoria.Empresas);
        
        // Add item
        var empresa = new Empresa { Nombre = "Empresa 1" };
        categoria.Empresas.Add(empresa);
        Assert.Single(categoria.Empresas);
        Assert.Equal("Empresa 1", categoria.Empresas.First().Nombre);
    }
}
