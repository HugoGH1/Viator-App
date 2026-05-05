namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class DeleteEventoUseCase : IDeleteEventoUseCase
{
    private readonly IEventoRepository _eventoRepository;

    public DeleteEventoUseCase(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task ExecuteAsync(Guid id)
    {
        var eventoExistente = await _eventoRepository.GetByIdAsync(id);
        
        if (eventoExistente == null)
        {
            throw new KeyNotFoundException($"No se encontró el evento con ID {id} para eliminar.");
        }

        await _eventoRepository.DeleteAsync(id);
    }
}
