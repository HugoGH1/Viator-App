using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Mappers;
using Xunit;

namespace EmpresasViator.Tests.Mappers;

public class EventoMapperTests
{
    private static CreateEventoDto BuildDto(Guid? id = null) => new()
    {
        Id = id ?? Guid.Empty,
        Titulo = "Evento Test",
        Descripcion = "Descripción del evento",
        Lugar = "Teatro Principal",
        FechaEvento = new DateTime(2025, 6, 15, 10, 0, 0, DateTimeKind.Utc),
        Precio = 150.00m,
        CapacidadMaxima = 200,
        IdEmpresa = Guid.NewGuid()
    };

    [Fact]
    public void ToEntity_WithEmptyGuid_GeneratesNewId()
    {
        var dto = BuildDto(id: Guid.Empty);
        var entity = dto.ToEntity();
        Assert.NotEqual(Guid.Empty, entity.Id);
    }

    [Fact]
    public void ToEntity_WithExistingGuid_KeepsId()
    {
        var existingId = Guid.NewGuid();
        var dto = BuildDto(id: existingId);
        var entity = dto.ToEntity();
        Assert.Equal(existingId, entity.Id);
    }

    [Fact]
    public void ToEntity_MapsAllFieldsCorrectly()
    {
        var dto = BuildDto(id: Guid.NewGuid());
        var entity = dto.ToEntity();

        Assert.Equal(dto.Titulo, entity.Titulo);
        Assert.Equal(dto.Descripcion, entity.Descripcion);
        Assert.Equal(dto.Lugar, entity.Lugar);
        Assert.Equal(dto.FechaEvento.ToUniversalTime(), entity.FechaEvento);
        Assert.Equal(dto.Precio, entity.Precio);
        Assert.Equal(dto.CapacidadMaxima, entity.CapacidadMaxima);
        Assert.Equal(dto.IdEmpresa, entity.IdEmpresa);
    }
}
