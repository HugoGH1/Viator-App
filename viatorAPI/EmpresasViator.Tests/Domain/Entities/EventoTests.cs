using EmpresasViator.Domain.Entities;

namespace EmpresasViator.Tests.Domain.Entities;

public class EventoTests
{
    [Fact]
    public void Evento_ShouldSetPropertiesCorrectly()
    {
        // Act
        var evento = new Evento
        {
            Id = Guid.NewGuid(),
            Titulo = "Gran Concierto",
            Descripcion = "Concierto de rock",
            Lugar = "Arena Monterrey",
            FechaEvento = new DateTime(2023, 10, 15),
            Precio = 500.50m,
            CapacidadMaxima = 10000,
            IdEmpresa = Guid.NewGuid(),
            Empresa = new Empresa { Nombre = "Promo Rock" }
        };

        // Assert
        Assert.NotEqual(Guid.Empty, evento.Id);
        Assert.Equal("Gran Concierto", evento.Titulo);
        Assert.Equal("Concierto de rock", evento.Descripcion);
        Assert.Equal("Arena Monterrey", evento.Lugar);
        Assert.Equal(new DateTime(2023, 10, 15), evento.FechaEvento);
        Assert.Equal(500.50m, evento.Precio);
        Assert.Equal(10000, evento.CapacidadMaxima);
        Assert.NotEqual(Guid.Empty, evento.IdEmpresa);
        Assert.NotNull(evento.Empresa);
        Assert.Equal("Promo Rock", evento.Empresa.Nombre);
    }
}
