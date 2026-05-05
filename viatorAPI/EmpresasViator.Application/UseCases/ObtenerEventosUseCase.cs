namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Domain.Entities;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class ObtenerEventosUseCase : IObtenerEventosUseCase
{
    private readonly IEventoRepository _eventoRepository;

    public ObtenerEventosUseCase(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task<IEnumerable<Evento>> ExecuteAsync()
    {
        return await _eventoRepository.GetAllAsync();
    }
}
