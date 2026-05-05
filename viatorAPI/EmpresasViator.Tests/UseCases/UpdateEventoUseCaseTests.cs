using EmpresasViator.Application.UseCases;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class UpdateEventoUseCaseTests
{
    private static CreateEventoDto BuildDto(string lugar = "Teatro", DateTime? fecha = null) => new()
    {
        Titulo = "Evento Actualizado",
        Descripcion = "Nueva descripción",
        Lugar = lugar,
        FechaEvento = fecha ?? new DateTime(2025, 8, 10, 20, 0, 0, DateTimeKind.Utc),
        Precio = 300m,
        CapacidadMaxima = 300,
        IdEmpresa = Guid.NewGuid()
    };

    [Fact]
    public async Task ExecuteAsync_EventoNotFound_ThrowsKeyNotFoundException()
    {
        var id = Guid.NewGuid();
        var dto = BuildDto();
        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Evento?)null);

        var useCase = new UpdateEventoUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => useCase.ExecuteAsync(id, dto));
        mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Evento>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_LugarFechaChanged_AndConflictExists_ThrowsInvalidOperationException()
    {
        var id = Guid.NewGuid();
        var fecha = new DateTime(2025, 8, 10, 20, 0, 0, DateTimeKind.Utc);
        var dto = BuildDto(lugar: "Nuevo Lugar", fecha: fecha);

        var existente = new Evento
        {
            Id = id,
            Lugar = "Lugar Original",
            FechaEvento = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existente);
        mockRepo.Setup(r => r.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento)).ReturnsAsync(true);

        var useCase = new UpdateEventoUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(id, dto));
        mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Evento>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_LugarFechaChanged_NoConflict_UpdatesEvento()
    {
        var id = Guid.NewGuid();
        var fecha = new DateTime(2025, 8, 10, 20, 0, 0, DateTimeKind.Utc);
        var dto = BuildDto(lugar: "Nuevo Lugar", fecha: fecha);

        var existente = new Evento
        {
            Id = id,
            Lugar = "Lugar Original",
            FechaEvento = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existente);
        mockRepo.Setup(r => r.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento)).ReturnsAsync(false);
        mockRepo.Setup(r => r.UpdateAsync(existente)).Returns(Task.CompletedTask);

        var useCase = new UpdateEventoUseCase(mockRepo.Object);

        await useCase.ExecuteAsync(id, dto);

        Assert.Equal(dto.Titulo, existente.Titulo);
        Assert.Equal(dto.Lugar, existente.Lugar);
        mockRepo.Verify(r => r.UpdateAsync(existente), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_SameLugarFecha_SkipsConflictCheck_UpdatesEvento()
    {
        var id = Guid.NewGuid();
        var fecha = new DateTime(2025, 8, 10, 20, 0, 0, DateTimeKind.Utc);
        var dto = BuildDto(lugar: "Teatro", fecha: fecha);

        var existente = new Evento
        {
            Id = id,
            Lugar = "Teatro",
            FechaEvento = fecha
        };

        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existente);
        mockRepo.Setup(r => r.UpdateAsync(existente)).Returns(Task.CompletedTask);

        var useCase = new UpdateEventoUseCase(mockRepo.Object);

        await useCase.ExecuteAsync(id, dto);

        mockRepo.Verify(r => r.ExisteEventoEnLugarYFechaAsync(It.IsAny<string>(), It.IsAny<DateTime>()), Times.Never);
        mockRepo.Verify(r => r.UpdateAsync(existente), Times.Once);
    }
}
