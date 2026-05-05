using EmpresasViator.Api.Controllers;
using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EmpresasViator.Tests.Controllers;

public class EventoControllerTests
{
    private readonly Mock<IRegistrarEventoUseCase> _registrar = new();
    private readonly Mock<IObtenerEventosUseCase> _obtener = new();
    private readonly Mock<IUpdateEventoUseCase> _update = new();
    private readonly Mock<IDeleteEventoUseCase> _delete = new();

    private EventoController BuildController() =>
        new(_registrar.Object, _obtener.Object, _update.Object, _delete.Object);

    private static CreateEventoDto BuildDto() => new()
    {
        Lugar = "Teatro",
        FechaEvento = DateTime.UtcNow,
        IdEmpresa = Guid.NewGuid()
    };

    // RegistrarEvento

    [Fact]
    public async Task RegistrarEvento_Success_Returns201Created()
    {
        var id = Guid.NewGuid();
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEventoDto>())).ReturnsAsync(id);

        var result = await BuildController().RegistrarEvento(BuildDto());

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created.StatusCode);
    }

    [Fact]
    public async Task RegistrarEvento_InvalidOperation_Returns400BadRequest()
    {
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEventoDto>()))
            .ThrowsAsync(new InvalidOperationException("Conflicto"));

        var result = await BuildController().RegistrarEvento(BuildDto());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RegistrarEvento_GenericException_Returns500()
    {
        _registrar.Setup(u => u.ExecuteAsync(It.IsAny<CreateEventoDto>()))
            .ThrowsAsync(new Exception("Fallo general"));

        var result = await BuildController().RegistrarEvento(BuildDto());

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    // GetAllAsync

    [Fact]
    public async Task GetAllAsync_Success_Returns200Ok()
    {
        _obtener.Setup(u => u.ExecuteAsync()).ReturnsAsync(new List<Evento>());

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

    // UpdateEvento

    [Fact]
    public async Task UpdateEvento_Success_Returns200Ok()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEventoDto>()))
            .Returns(Task.CompletedTask);

        var result = await BuildController().UpdateEvento(Guid.NewGuid(), BuildDto());

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task UpdateEvento_KeyNotFound_Returns404NotFound()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEventoDto>()))
            .ThrowsAsync(new KeyNotFoundException("No encontrado"));

        var result = await BuildController().UpdateEvento(Guid.NewGuid(), BuildDto());

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateEvento_InvalidOperation_Returns400BadRequest()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEventoDto>()))
            .ThrowsAsync(new InvalidOperationException("Conflicto"));

        var result = await BuildController().UpdateEvento(Guid.NewGuid(), BuildDto());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdateEvento_GenericException_Returns500()
    {
        _update.Setup(u => u.ExecuteAsync(It.IsAny<Guid>(), It.IsAny<CreateEventoDto>()))
            .ThrowsAsync(new Exception("Fallo general"));

        var result = await BuildController().UpdateEvento(Guid.NewGuid(), BuildDto());

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    // DeleteEvento

    [Fact]
    public async Task DeleteEvento_Success_Returns200Ok()
    {
        _delete.Setup(u => u.ExecuteAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);

        var result = await BuildController().DeleteEvento(Guid.NewGuid());

        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task DeleteEvento_KeyNotFound_Returns404NotFound()
    {
        _delete.Setup(u => u.ExecuteAsync(It.IsAny<Guid>()))
            .ThrowsAsync(new KeyNotFoundException("No encontrado"));

        var result = await BuildController().DeleteEvento(Guid.NewGuid());

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteEvento_GenericException_Returns500()
    {
        _delete.Setup(u => u.ExecuteAsync(It.IsAny<Guid>()))
            .ThrowsAsync(new Exception("Fallo general"));

        var result = await BuildController().DeleteEvento(Guid.NewGuid());

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }
}
