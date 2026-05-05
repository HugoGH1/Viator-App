namespace EmpresasViator.Domain.Repositories;

using EmpresasViator.Domain.Entities;

public interface IEmpresaRepository
{
    Task<Empresa?> GetByIdAsync(Guid id);
    Task<IEnumerable<Empresa>> GetAllAsync();
    Task<Empresa> CreateAsync(Empresa empresa);
    Task UpdateAsync(Empresa empresa);
    Task DeleteAsync(Guid id);
    Task<bool> ExisteRFCAsync(string rfc);
}