namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;

public interface IObtenerEmpresaPorIdUseCase
{
    Task<CreateEmpresaDto> ExecuteAsync(Guid id);
}
