namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Mappers;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class RegistrarEventoUseCase : IRegistrarEventoUseCase
{
    private readonly IEventoRepository _eventoRepository;

    public RegistrarEventoUseCase(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateEventoDto dto)
    {
        if (await _eventoRepository.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento))
        {
            throw new InvalidOperationException("¡Ya existe un evento registrado en este lugar y fecha!");
        }

        var nuevoEvento = dto.ToEntity();

        await _eventoRepository.CreateAsync(nuevoEvento);

        return nuevoEvento.Id;
    }
}
