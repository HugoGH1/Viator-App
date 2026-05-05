namespace EmpresasViator.Application.UseCases;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Application.Mappers;

public class UpdateEmpresaUseCase : IUpdateEmpresaUseCase
{
    private readonly IEmpresaRepository _empresaRepository;

    public UpdateEmpresaUseCase(IEmpresaRepository empresaRepository)
    {
        _empresaRepository = empresaRepository;
    }

    public async Task ExecuteAsync(Guid id, CreateEmpresaDto dto)
    {
        var empresa = await _empresaRepository.GetByIdAsync(id);
        if (empresa == null)
        {
            throw new InvalidOperationException("Empresa no encontrada.");
        }

        empresa.UpdateFromDto(dto);

        await _empresaRepository.UpdateAsync(empresa);
    }
}