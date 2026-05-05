using EmpresasViator.Application.UseCases;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class DeleteEventoUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_EventoNotFound_ThrowsKeyNotFoundException()
    {
        var id = Guid.NewGuid();
        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Evento?)null);

        var useCase = new DeleteEventoUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => useCase.ExecuteAsync(id));
        mockRepo.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_EventoFound_CallsDeleteAsync()
    {
        var id = Guid.NewGuid();
        var evento = new Evento { Id = id, Titulo = "Evento Test" };

        var mockRepo = new Mock<IEventoRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(evento);
        mockRepo.Setup(r => r.DeleteAsync(id)).Returns(Task.CompletedTask);

        var useCase = new DeleteEventoUseCase(mockRepo.Object);

        await useCase.ExecuteAsync(id);

        mockRepo.Verify(r => r.DeleteAsync(id), Times.Once);
    }
}
