namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.Interfaces;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Application.Mappers;

public class ObtenerEmpresasUseCase : IObtenerEmpresasUseCase
{
    private readonly IEmpresaRepository _repository;

    public ObtenerEmpresasUseCase(IEmpresaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmpresaCardDto>> ExecuteAsync()
    {
        var empresas = await _repository.GetAllAsync();
        return empresas.Select(e => e.ToCardDto());
    }
}