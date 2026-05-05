namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;

public interface IObtenerEmpresasUseCase
{
    Task<IEnumerable<EmpresaCardDto>> ExecuteAsync();
}