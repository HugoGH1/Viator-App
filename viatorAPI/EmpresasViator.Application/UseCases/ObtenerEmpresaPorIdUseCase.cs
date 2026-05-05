namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.Interfaces;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Application.Mappers;

public class ObtenerEmpresaPorIdUseCase : IObtenerEmpresaPorIdUseCase
{
    private readonly IEmpresaRepository _repository;

    public ObtenerEmpresaPorIdUseCase(IEmpresaRepository repository)
    {
        _repository = repository;
    }

    public async Task<CreateEmpresaDto> ExecuteAsync(Guid id)
    {
        var empresa = await _repository.GetByIdAsync(id);
        
        if (empresa == null)
        {
            throw new KeyNotFoundException($"No se encontró la empresa con ID {id}.");
        }

        return empresa.ToDto();
    }
}
