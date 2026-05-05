namespace EmpresasViator.Application.UseCases;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class DeleteEmpresaUseCase : IDeleteEmpresaUseCase
{
    private readonly IEmpresaRepository _empresaRepository;

    public DeleteEmpresaUseCase(IEmpresaRepository empresaRepository)
    {
        _empresaRepository = empresaRepository;
    }

    public async Task ExecuteAsync(Guid id)
    {
        var empresa = await _empresaRepository.GetByIdAsync(id);
        if (empresa == null) throw new InvalidOperationException("Empresa no encontrada.");

        await _empresaRepository.DeleteAsync(id);
    }
}