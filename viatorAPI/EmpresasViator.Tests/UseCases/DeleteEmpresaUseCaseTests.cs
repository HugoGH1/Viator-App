using EmpresasViator.Application.UseCases;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class DeleteEmpresaUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_EmpresaNotFound_ThrowsInvalidOperationException()
    {
        var id = Guid.NewGuid();
        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Empresa?)null);

        var useCase = new DeleteEmpresaUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(id));
        mockRepo.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_EmpresaFound_CallsDeleteAsync()
    {
        var id = Guid.NewGuid();
        var empresa = new Empresa { Id = id };

        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(empresa);
        mockRepo.Setup(r => r.DeleteAsync(id)).Returns(Task.CompletedTask);

        var useCase = new DeleteEmpresaUseCase(mockRepo.Object);

        await useCase.ExecuteAsync(id);

        mockRepo.Verify(r => r.DeleteAsync(id), Times.Once);
    }
}
