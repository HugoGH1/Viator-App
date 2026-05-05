namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Mappers;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class RegistrarEmpresaUseCase : IRegistrarEmpresaUseCase
{
    private readonly IEmpresaRepository _empresaRepository;

    public RegistrarEmpresaUseCase(IEmpresaRepository empresaRepository)
    {
        _empresaRepository = empresaRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateEmpresaDto dto)
    {
        if (await _empresaRepository.ExisteRFCAsync(dto.RFC))
        {
            throw new InvalidOperationException("¡Ya existe una empresa registrada con este RFC!");
        }

        var nuevaEmpresa = dto.ToEntity();

        await _empresaRepository.CreateAsync(nuevaEmpresa);

        return nuevaEmpresa.Id;
    }
}

