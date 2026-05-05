using EmpresasViator.Application.UseCases;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class ObtenerEventosUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_ReturnsAllEventos()
    {
        var eventos = new List<Evento>
        {
            new() { Id = Guid.NewGuid(), Titulo = "Evento A" },
            new() { Id = Guid.NewGuid(), Titulo = "Evento B" }
        };

        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(eventos);

        var useCase = new ObtenerEventosUseCase(mockRepo.Object);

        var result = await useCase.ExecuteAsync();

        var list = result.ToList();
        Assert.Equal(2, list.Count);
        Assert.Equal("Evento A", list[0].Titulo);
        mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
    }
}
