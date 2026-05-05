namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;

public interface IUpdateEventoUseCase
{
    Task ExecuteAsync(Guid id, CreateEventoDto dto);
}
