namespace EmpresasViator.Infrastructure.Repositories;

using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class EventoRepository : IEventoRepository
{
    private readonly ApplicationDbContext _context;

    public EventoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Evento> CreateAsync(Evento evento)
    {
        await _context.Eventos.AddAsync(evento);
        await _context.SaveChangesAsync();
        
        return evento;
    }

    public async Task<bool> ExisteEventoEnLugarYFechaAsync(string lugar, DateTime fecha)
    {
        return await _context.Eventos.AnyAsync(e => e.Lugar == lugar && e.FechaEvento == fecha);
    }

    public async Task<Evento?> GetByIdAsync(Guid id)
    {
        return await _context.Eventos.FindAsync(id);
    }

    public async Task<IEnumerable<Evento>> GetAllAsync()
    {
        return await _context.Eventos.ToListAsync();
    }

    public async Task UpdateAsync(Evento evento)
    {
        _context.Eventos.Update(evento);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var evento = await GetByIdAsync(id);
        if (evento != null)
        {
            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();
        }
    }
}
