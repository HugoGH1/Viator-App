namespace EmpresasViator.Domain.Repositories;

using EmpresasViator.Domain.Entities;

public interface IEventoRepository
{
    Task<Evento?> GetByIdAsync(Guid id);
    Task<IEnumerable<Evento>> GetAllAsync();
    Task<Evento> CreateAsync(Evento evento);
    Task UpdateAsync(Evento evento);
    Task DeleteAsync(Guid id);
    Task<bool> ExisteEventoEnLugarYFechaAsync(string lugar, DateTime fecha);
}
