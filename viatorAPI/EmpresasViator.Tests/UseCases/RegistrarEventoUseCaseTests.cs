using EmpresasViator.Application.UseCases;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class RegistrarEventoUseCaseTests
{
    private static CreateEventoDto BuildDto() => new()
    {
        Titulo = "Festival",
        Descripcion = "Gran festival",
        Lugar = "Plaza Mayor",
        FechaEvento = new DateTime(2025, 7, 20, 18, 0, 0, DateTimeKind.Utc),
        Precio = 200m,
        CapacidadMaxima = 500,
        IdEmpresa = Guid.NewGuid()
    };

    [Fact]
    public async Task ExecuteAsync_LugarFechaAlreadyExists_ThrowsInvalidOperationException()
    {
        var dto = BuildDto();
        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento)).ReturnsAsync(true);

        var useCase = new RegistrarEventoUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(dto));
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Evento>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_NoConflict_CreatesAndReturnsNewGuid()
    {
        var dto = BuildDto();
        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento)).ReturnsAsync(false);
        mockRepo.Setup(r => r.CreateAsync(It.IsAny<Evento>())).ReturnsAsync((Evento e) => e);

        var useCase = new RegistrarEventoUseCase(mockRepo.Object);

        var id = await useCase.ExecuteAsync(dto);

        Assert.NotEqual(Guid.Empty, id);
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Evento>()), Times.Once);
    }
}
