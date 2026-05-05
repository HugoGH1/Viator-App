namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Application.dtos;

public interface IRegistrarEventoUseCase
{
    Task<Guid> ExecuteAsync(CreateEventoDto dto);
}
