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

public class EmpresaRepositoryTests
{
    private DbContextOptions<ApplicationDbContext> CreateNewContextOptions()
    {
        return new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task CreateAsync_ShouldAddEmpresaAndReturnIt()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EmpresaRepository(context);
        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            RFC = "ABCD123456EFG",
            Nombre = "Test Company"
        };

        // Act
        var result = await repository.CreateAsync(empresa);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(empresa.Id, result.Id);
        Assert.Equal(1, context.Empresas.Count());
    }

    [Fact]
    public async Task ExisteRFCAsync_ShouldReturnTrueIfRFCExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var empresa = new Empresa { Id = Guid.NewGuid(), RFC = "EXISTING_RFC", Nombre = "Test" };
        context.Empresas.Add(empresa);
        await context.SaveChangesAsync();

        var repository = new EmpresaRepository(context);

        // Act
        var result = await repository.ExisteRFCAsync("EXISTING_RFC");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ExisteRFCAsync_ShouldReturnFalseIfRFCDoesNotExist()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EmpresaRepository(context);

        // Act
        var result = await repository.ExisteRFCAsync("NON_EXISTING_RFC");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnEmpresaIfItExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using var context = new ApplicationDbContext(options);
        var empresa = new Empresa { Id = id, RFC = "TEST", Nombre = "Test" };
        context.Empresas.Add(empresa);
        await context.SaveChangesAsync();

        var repository = new EmpresaRepository(context);

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
        var repository = new EmpresaRepository(context);

        // Act
        var result = await repository.GetByIdAsync(Guid.NewGuid());

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllEmpresasWithCategoria()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var categoria = new Categoria { Id = Guid.NewGuid(), Nombre = "Cat" };
        var empresa1 = new Empresa { Id = Guid.NewGuid(), RFC = "1", Nombre = "T1", idCategoria = categoria.Id, Categoria = categoria };
        var empresa2 = new Empresa { Id = Guid.NewGuid(), RFC = "2", Nombre = "T2", idCategoria = categoria.Id, Categoria = categoria };
        
        context.Categorias.Add(categoria);
        context.Empresas.AddRange(empresa1, empresa2);
        await context.SaveChangesAsync();

        var repository = new EmpresaRepository(context);

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
        Assert.NotNull(result.First().Categoria);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateEmpresa()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using (var context = new ApplicationDbContext(options))
        {
            var empresaOriginal = new Empresa { Id = id, RFC = "OLD", Nombre = "Old" };
            context.Empresas.Add(empresaOriginal);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new EmpresaRepository(context);
            var empresaToUpdate = new Empresa { Id = id, RFC = "NEW", Nombre = "New" };

            // Act
            await repository.UpdateAsync(empresaToUpdate);
        }

        using (var context = new ApplicationDbContext(options))
        {
            var result = await context.Empresas.FindAsync(id);
            Assert.NotNull(result);
            Assert.Equal("NEW", result.RFC);
            Assert.Equal("New", result.Nombre);
        }
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveEmpresaIfItExists()
    {
        // Arrange
        var options = CreateNewContextOptions();
        var id = Guid.NewGuid();
        using (var context = new ApplicationDbContext(options))
        {
            var empresa = new Empresa { Id = id, RFC = "TEST", Nombre = "Test" };
            context.Empresas.Add(empresa);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new EmpresaRepository(context);

            // Act
            await repository.DeleteAsync(id);
        }

        using (var context = new ApplicationDbContext(options))
        {
            var result = await context.Empresas.FindAsync(id);
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task DeleteAsync_ShouldDoNothingIfEmpresaDoesNotExist()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new ApplicationDbContext(options);
        var repository = new EmpresaRepository(context);

        // Act & Assert (No exception should be thrown)
        await repository.DeleteAsync(Guid.NewGuid());
        Assert.Empty(context.Empresas);
    }
}
