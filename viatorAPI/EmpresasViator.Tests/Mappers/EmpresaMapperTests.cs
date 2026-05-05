using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Mappers;
using EmpresasViator.Domain.Entities;
using Xunit;

namespace EmpresasViator.Tests.Mappers;

public class EmpresaMapperTests
{
    private static CreateEmpresaDto BuildDto(string ciudad = "CDMX", string estado = "CDMX") => new()
    {
        idAdmin = "admin1",
        Nombre = "Empresa Test",
        RFC = "EMP123456",
        Calle = "Av. Principal",
        NumExt = "100",
        NumInt = "A",
        Colonia = "Centro",
        Ciudad = ciudad,
        Estado = estado,
        CodigoPostal = "34000",
        Telefono = "6181234567",
        idCategoria = Guid.NewGuid()
    };

    // ToEntity

    [Fact]
    public void ToEntity_MapsAllFieldsCorrectly()
    {
        var dto = BuildDto();
        var entity = dto.ToEntity();

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal(dto.idAdmin, entity.idAdmin);
        Assert.Equal(dto.Nombre, entity.Nombre);
        Assert.Equal(dto.RFC, entity.RFC);
        Assert.Equal(dto.Calle, entity.Calle);
        Assert.Equal(dto.NumExt, entity.NumExt);
        Assert.Equal(dto.NumInt, entity.NumInt);
        Assert.Equal(dto.Colonia, entity.Colonia);
        Assert.Equal(dto.Ciudad, entity.Ciudad);
        Assert.Equal(dto.Estado, entity.Estado);
        Assert.Equal(dto.CodigoPostal, entity.CodigoPostal);
        Assert.Equal(dto.Telefono, entity.Telefono);
        Assert.Equal(dto.idCategoria, entity.idCategoria);
    }

    [Fact]
    public void ToEntity_CiudadBlank_DefaultsToDurango()
    {
        var dto = BuildDto(ciudad: "   ");
        var entity = dto.ToEntity();
        Assert.Equal("Durango", entity.Ciudad);
    }

    [Fact]
    public void ToEntity_EstadoBlank_DefaultsToDurango()
    {
        var dto = BuildDto(estado: "");
        var entity = dto.ToEntity();
        Assert.Equal("Durango", entity.Estado);
    }

    // ToCardDto

    [Fact]
    public void ToCardDto_MapsAllFieldsCorrectly()
    {
        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            Nombre = "Empresa Test",
            RFC = "EMP123",
            Ciudad = "Durango",
            Categoria = new Categoria { Nombre = "Turismo" }
        };

        var cardDto = empresa.ToCardDto();

        Assert.Equal(empresa.Id, cardDto.Id);
        Assert.Equal(empresa.Nombre, cardDto.Nombre);
        Assert.Equal(empresa.RFC, cardDto.RFC);
        Assert.Equal(empresa.Ciudad, cardDto.Ciudad);
        Assert.Equal(empresa.Categoria.Nombre, cardDto.Categoria);
    }

    [Fact]
    public void ToCardDto_CiudadNull_DefaultsToDurango()
    {
        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            Nombre = "Test",
            RFC = "RFC",
            Ciudad = null!,
            Categoria = new Categoria { Nombre = "Cat" }
        };

        var cardDto = empresa.ToCardDto();
        Assert.Equal("Durango", cardDto.Ciudad);
    }

    // UpdateFromDto

    [Fact]
    public void UpdateFromDto_MapsAllFieldsCorrectly()
    {
        var empresa = new Empresa { Ciudad = "Durango", Estado = "Durango" };
        var dto = BuildDto(ciudad: "Guadalajara", estado: "Jalisco");

        empresa.UpdateFromDto(dto);

        Assert.Equal(dto.Nombre, empresa.Nombre);
        Assert.Equal(dto.RFC, empresa.RFC);
        Assert.Equal(dto.Calle, empresa.Calle);
        Assert.Equal(dto.NumExt, empresa.NumExt);
        Assert.Equal(dto.NumInt, empresa.NumInt);
        Assert.Equal(dto.Colonia, empresa.Colonia);
        Assert.Equal("Guadalajara", empresa.Ciudad);
        Assert.Equal("Jalisco", empresa.Estado);
        Assert.Equal(dto.CodigoPostal, empresa.CodigoPostal);
        Assert.Equal(dto.Telefono, empresa.Telefono);
        Assert.Equal(dto.idCategoria, empresa.idCategoria);
    }

    [Fact]
    public void UpdateFromDto_CiudadBlank_KeepsOriginal()
    {
        var empresa = new Empresa { Ciudad = "Durango" };
        var dto = BuildDto(ciudad: "  ");

        empresa.UpdateFromDto(dto);

        Assert.Equal("Durango", empresa.Ciudad);
    }

    [Fact]
    public void UpdateFromDto_EstadoBlank_KeepsOriginal()
    {
        var empresa = new Empresa { Estado = "Durango" };
        var dto = BuildDto(estado: "");

        empresa.UpdateFromDto(dto);

        Assert.Equal("Durango", empresa.Estado);
    }
}
