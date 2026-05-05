using EmpresasViator.Domain.Entities;

namespace EmpresasViator.Tests.Domain.Entities;

public class EmpresaTests
{
    [Fact]
    public void Empresa_ShouldSetPropertiesCorrectly()
    {
        // Act
        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            idAdmin = "admin123",
            Nombre = "Mi Empresa",
            RFC = "ABC123456T1",
            Calle = "Calle Falsa",
            NumExt = "123",
            NumInt = "A",
            Colonia = "Centro",
            Ciudad = "Monterrey",
            Estado = "Nuevo León",
            CodigoPostal = "64000",
            Telefono = "8112345678",
            FechaRegistro = new DateTime(2023, 1, 1),
            idCategoria = Guid.NewGuid(),
            Categoria = new Categoria { Nombre = "Tecnología" }
        };

        // Assert
        Assert.NotEqual(Guid.Empty, empresa.Id);
        Assert.Equal("admin123", empresa.idAdmin);
        Assert.Equal("Mi Empresa", empresa.Nombre);
        Assert.Equal("ABC123456T1", empresa.RFC);
        Assert.Equal("Calle Falsa", empresa.Calle);
        Assert.Equal("123", empresa.NumExt);
        Assert.Equal("A", empresa.NumInt);
        Assert.Equal("Centro", empresa.Colonia);
        Assert.Equal("Monterrey", empresa.Ciudad);
        Assert.Equal("Nuevo León", empresa.Estado);
        Assert.Equal("64000", empresa.CodigoPostal);
        Assert.Equal("8112345678", empresa.Telefono);
        Assert.Equal(new DateTime(2023, 1, 1), empresa.FechaRegistro);
        Assert.NotEqual(Guid.Empty, empresa.idCategoria);
        Assert.NotNull(empresa.Categoria);
        Assert.Equal("Tecnología", empresa.Categoria.Nombre);
    }

    [Fact]
    public void Empresa_ShouldInitializeCollections()
    {
        // Act
        var empresa = new Empresa();

        // Assert
        Assert.NotNull(empresa.Eventos);
        Assert.Empty(empresa.Eventos);
        
        // Add item
        var evento = new Evento { Titulo = "Evento 1" };
        empresa.Eventos.Add(evento);
        Assert.Single(empresa.Eventos);
        Assert.Equal("Evento 1", empresa.Eventos.First().Titulo);
    }
}
