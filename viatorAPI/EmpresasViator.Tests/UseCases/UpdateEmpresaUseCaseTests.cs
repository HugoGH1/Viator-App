using EmpresasViator.Application.UseCases;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class UpdateEmpresaUseCaseTests
{
    private static CreateEmpresaDto BuildDto() => new()
    {
        Nombre = "Empresa Actualizada",
        RFC = "UPD123",
        Calle = "Calle Nueva",
        NumExt = "200",
        Colonia = "Nueva",
        Ciudad = "Monterrey",
        Estado = "Nuevo León",
        CodigoPostal = "64000",
        Telefono = "8181234567",
        idCategoria = Guid.NewGuid()
    };

    [Fact]
    public async Task ExecuteAsync_EmpresaNotFound_ThrowsInvalidOperationException()
    {
        var id = Guid.NewGuid();
        var dto = BuildDto();
        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Empresa?)null);

        var useCase = new UpdateEmpresaUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(id, dto));
        mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Empresa>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_EmpresaFound_UpdatesAndCallsRepository()
    {
        var id = Guid.NewGuid();
        var dto = BuildDto();
        var empresa = new Empresa { Id = id, Nombre = "Original", RFC = "OLD" };

        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(empresa);
        mockRepo.Setup(r => r.UpdateAsync(empresa)).Returns(Task.CompletedTask);

        var useCase = new UpdateEmpresaUseCase(mockRepo.Object);

        await useCase.ExecuteAsync(id, dto);

        Assert.Equal(dto.Nombre, empresa.Nombre);
        Assert.Equal(dto.RFC, empresa.RFC);
        mockRepo.Verify(r => r.UpdateAsync(empresa), Times.Once);
    }
}
