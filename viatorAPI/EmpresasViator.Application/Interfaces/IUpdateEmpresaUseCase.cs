namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;

public interface IUpdateEmpresaUseCase
{
    Task ExecuteAsync(Guid id, CreateEmpresaDto dto);
}