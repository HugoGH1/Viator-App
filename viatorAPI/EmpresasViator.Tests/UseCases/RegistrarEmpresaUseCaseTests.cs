using EmpresasViator.Application.UseCases;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class RegistrarEmpresaUseCaseTests
{
    private static CreateEmpresaDto BuildDto() => new()
    {
        Nombre = "Empresa Test",
        RFC = "EMP123456",
        Calle = "Av. Principal",
        NumExt = "100",
        Colonia = "Centro",
        Ciudad = "Durango",
        Estado = "Durango",
        CodigoPostal = "34000",
        Telefono = "6181234567",
        idCategoria = Guid.NewGuid()
    };

    [Fact]
    public async Task ExecuteAsync_RFCAlreadyExists_ThrowsInvalidOperationException()
    {
        var dto = BuildDto();
        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.ExisteRFCAsync(dto.RFC)).ReturnsAsync(true);

        var useCase = new RegistrarEmpresaUseCase(mockRepo.Object);

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(dto));
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Empresa>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_RFCNotExists_CreatesAndReturnsNewGuid()
    {
        var dto = BuildDto();
        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.ExisteRFCAsync(dto.RFC)).ReturnsAsync(false);
        mockRepo.Setup(r => r.CreateAsync(It.IsAny<Empresa>())).ReturnsAsync((Empresa e) => e);

        var useCase = new RegistrarEmpresaUseCase(mockRepo.Object);

        var id = await useCase.ExecuteAsync(dto);

        Assert.NotEqual(Guid.Empty, id);
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Empresa>()), Times.Once);
    }
}
