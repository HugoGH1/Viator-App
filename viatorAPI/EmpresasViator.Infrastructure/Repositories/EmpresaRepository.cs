namespace EmpresasViator.Infrastructure.Repositories;

using EmpresasViator.Domain.Entities;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class EmpresaRepository : IEmpresaRepository
{
    private readonly ApplicationDbContext _context;

    public EmpresaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Empresa> CreateAsync(Empresa empresa)
    {
        await _context.Empresas.AddAsync(empresa);
        await _context.SaveChangesAsync();
        
        return empresa;
    }

    public async Task<bool> ExisteRFCAsync(string rfc)
    {
        return await _context.Empresas.AnyAsync(e => e.RFC == rfc);
    }

    // --- Implementaciones requeridas por la interfaz original ---

    public async Task<Empresa?> GetByIdAsync(Guid id)
    {
        return await _context.Empresas.FindAsync(id);
    }

    public async Task<IEnumerable<Empresa>> GetAllAsync()
    {
        return await _context.Empresas
        .Include(e => e.Categoria)
        .ToListAsync();
    }

    public async Task UpdateAsync(Empresa empresa)
    {
        _context.Empresas.Update(empresa);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var empresa = await GetByIdAsync(id);
        if (empresa != null)
        {
            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();
        }
    }
}
