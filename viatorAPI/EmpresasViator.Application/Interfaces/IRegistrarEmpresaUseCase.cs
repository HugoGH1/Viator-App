namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;

public interface IRegistrarEmpresaUseCase
{
    Task<Guid> ExecuteAsync(CreateEmpresaDto dto);
}
