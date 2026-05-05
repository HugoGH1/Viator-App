using EmpresasViator.Api.Controllers;
using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.Controllers;

public class EmpresaControllerTests
{
    private readonly Mock<IRegistrarEmpresaUseCase> _registrar = new();
    private readonly Mock<IObtenerEmpresasUseCase> _obtener = new();
    private readonly Mock<IUpdateEmpresaUseCase> _update = new();
    private readonly Mock<IDeleteEmpresaUseCase> _delete = new();

    private EmpresaController BuildController() =>
        new(_registrar.Object, _obtener.Object, _update.Object, _delete.Object);

    private static CreateEmpresaDto BuildDto() => new() { RFC = "RFC123" };

    //  RegistrarEmpresa

    [Fact]
    public async Task RegistrarEmpresa_Success_Returns201Created()
    {
        var id = Guid.NewGuid();
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEmpresaDto>())).ReturnsAsync(id);

        var result = await BuildController().RegistrarEmpresa(BuildDto());

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created.StatusCode);
    }

    [Fact]
    public async Task RegistrarEmpresa_InvalidOperation_Returns400BadRequest()
    {
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEmpresaDto>()))
            .ThrowsAsync(new InvalidOperationException("RFC duplicado"));

        var result = await BuildController().RegistrarEmpresa(BuildDto());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RegistrarEmpresa_GenericException_Returns500()
    {
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEmpresaDto>()))
            .ThrowsAsync(new Exception("Fallo general"));

        var result = await BuildController().RegistrarEmpresa(BuildDto());

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    //GetAllAsync

    [Fact]
    public async Task GetAllAsync_Success_Returns200Ok()
    {
        _obtener.Setup(u => u.ExecuteAsync()).ReturnsAsync(new List<EmpresaCardDto>());

        var result = await BuildController().GetAllAsync();

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetAllAsync_Exception_Returns500()
    {
        _obtener.Setup(u => u.ExecuteAsync()).ThrowsAsync(new Exception("Error DB"));

        var result = await BuildController().GetAllAsync();

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    //UpdateEmpresa

    [Fact]
    public async Task UpdateEmpresa_Success_Returns200Ok()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEmpresaDto>()))
            .Returns(Task.CompletedTask);

        var result = await BuildController().UpdateEmpresa(Guid.NewGuid(), BuildDto());

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task UpdateEmpresa_KeyNotFound_Returns404NotFound()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEmpresaDto>()))
            .ThrowsAsync(new KeyNotFoundException("No encontrada"));

        var result = await BuildController().UpdateEmpresa(Guid.NewGuid(), BuildDto());

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateEmpresa_InvalidOperation_Returns400BadRequest()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEmpresaDto>()))
            .ThrowsAsync(new InvalidOperationException("Conflicto"));

        var result = await BuildController().UpdateEmpresa(Guid.NewGuid(), BuildDto());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    //DeleteEmpresa

    [Fact]
    public async Task DeleteEmpresa_Success_Returns200Ok()
    {
        _delete.Setup(u => u.ExecuteAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);

        var result = await BuildController().DeleteEmpresa(Guid.NewGuid());

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task DeleteEmpresa_KeyNotFound_Returns404NotFound()
    {
        _delete.Setup(u => u.ExecuteAsync(It.IsAny<Guid>()))
            .ThrowsAsync(new KeyNotFoundException("No encontrada"));

        var result = await BuildController().DeleteEmpresa(Guid.NewGuid());

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
