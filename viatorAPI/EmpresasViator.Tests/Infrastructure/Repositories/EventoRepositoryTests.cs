namespace EmpresasViator.Tests.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmpresasViator.Domain.Entities;
using EmpresasViator.Infrastructure.Context;
using EmpresasViator.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class EventoRepositoryTests
{
    private DbContextOptions<ApplicationDbContext> CreateNewContextOptions()
    {
        return new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task CreateAsync_ShouldAddEventoAndReturnIt()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EventoRepository(context);
        var evento = new Evento
        {
            Id = Guid.NewGuid(),
            Lugar = "Test Venue",
            FechaEvento = DateTime.Now.AddDays(1)
        };

        // Act
        var result = await repository.CreateAsync(evento);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(evento.Id, result.Id);
        Assert.Equal(1, context.Eventos.Count());
    }

    [Fact]
    public async Task ExisteEventoEnLugarYFechaAsync_ShouldReturnTrueIfExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var fecha = DateTime.Now.Date;
        var evento = new Evento { Id = Guid.NewGuid(), Lugar = "Venue", FechaEvento = fecha };
        context.Eventos.Add(evento);
        await context.SaveChangesAsync();

        var repository = new EventoRepository(context);

        // Act
        var result = await repository.ExisteEventoEnLugarYFechaAsync("Venue", fecha);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ExisteEventoEnLugarYFechaAsync_ShouldReturnFalseIfNotExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EventoRepository(context);

        // Act
        var result = await repository.ExisteEventoEnLugarYFechaAsync("Venue", DateTime.Now);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnEventoIfItExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using var context = new ApplicationDbContext(options);
        var evento = new Evento { Id = id, Lugar = "Venue", FechaEvento = DateTime.Now };
        context.Eventos.Add(evento);
        await context.SaveChangesAsync();

        var repository = new EventoRepository(context);

        // Act
        var result = await repository.GetByIdAsync(id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNullIfItDoesNotExist()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EventoRepository(context);

        // Act
        var result = await repository.GetByIdAsync(Guid.NewGuid());

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllEventos()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var evento1 = new Evento { Id = Guid.NewGuid(), Lugar = "V1", FechaEvento = DateTime.Now };
        var evento2 = new Evento { Id = Guid.NewGuid(), Lugar = "V2", FechaEvento = DateTime.Now };
        
        context.Eventos.AddRange(evento1, evento2);
        await context.SaveChangesAsync();

        var repository = new EventoRepository(context);

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateEvento()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using (var context = new ApplicationDbContext(options))
        {
            var eventoOriginal = new Evento { Id = id, Lugar = "OLD", FechaEvento = DateTime.Now };
            context.Eventos.Add(eventoOriginal);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new EventoRepository(context);
            var eventoToUpdate = new Evento { Id = id, Lugar = "NEW", FechaEvento = DateTime.Now.AddDays(1) };

            // Act
            await repository.UpdateAsync(eventoToUpdate);
        }

        using (var context = new ApplicationDbContext(options))
        {
            var result = await context.Eventos.FindAsync(id);
            Assert.NotNull(result);
            Assert.Equal("NEW", result.Lugar);
        }
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveEventoIfItExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using (var context = new ApplicationDbContext(options))
        {
            var evento = new Evento { Id = id, Lugar = "Venue", FechaEvento = DateTime.Now };
            context.Eventos.Add(evento);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new EventoRepository(context);

            // Act
            await repository.DeleteAsync(id);
        }

        using (var context = new ApplicationDbContext(options))
        {
            var result = await context.Eventos.FindAsync(id);
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task DeleteAsync_ShouldDoNothingIfEventoDoesNotExist()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EventoRepository(context);

        // Act & Assert (No exception should be thrown)
        await repository.DeleteAsync(Guid.NewGuid());
        Assert.Empty(context.Eventos);
    }
}
