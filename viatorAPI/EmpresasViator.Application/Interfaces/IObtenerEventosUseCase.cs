namespace EmpresasViator.Application.Interfaces;

using EmpresasViator.Domain.Entities;

public interface IObtenerEventosUseCase
{
    Task<IEnumerable<Evento>> ExecuteAsync();
}
