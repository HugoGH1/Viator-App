using EmpresasViator.Application.UseCases;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.UseCases;

public class ObtenerEmpresasUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_ReturnsAllEmpresasAsDtos()
    {
        var categoriaId = Guid.NewGuid();
        var empresas = new List<Empresa>
        {
            new() {
                Id = Guid.NewGuid(),
                Nombre = "Empresa A",
                RFC = "RFC1",
                Ciudad = "Durango",
                Categoria = new Categoria { Nombre = "Turismo" }
            },
            new() {
                Id = Guid.NewGuid(),
                Nombre = "Empresa B",
                RFC = "RFC2",
                Ciudad = "CDMX",
                Categoria = new Categoria { Nombre = "Alimentos" }
            }
        };

        var mockRepo = new Mock<IEmpresaRepository>();
        mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(empresas);

        var useCase = new ObtenerEmpresasUseCase(mockRepo.Object);
        var result = await useCase.ExecuteAsync();

        // Assert
        var list = result.ToList();
        Assert.Equal(2, list.Count);
        Assert.Equal("Empresa A", list[0].Nombre);
        Assert.Equal("Empresa B", list[1].Nombre);
        mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
    }
}
