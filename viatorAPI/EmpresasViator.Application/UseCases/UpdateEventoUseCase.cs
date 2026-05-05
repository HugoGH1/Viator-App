namespace EmpresasViator.Application.UseCases;

using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Domain.Repositories;

public class UpdateEventoUseCase : IUpdateEventoUseCase
{
    private readonly IEventoRepository _eventoRepository;

    public UpdateEventoUseCase(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task ExecuteAsync(Guid id, CreateEventoDto dto)
    {
        var eventoExistente = await _eventoRepository.GetByIdAsync(id);
        
        if (eventoExistente == null)
        {
            throw new KeyNotFoundException($"No se encontró el evento con ID {id}.");
        }

        // Si cambia de lugar y fecha, validar duplicidad
        if ((eventoExistente.Lugar != dto.Lugar || eventoExistente.FechaEvento != dto.FechaEvento.ToUniversalTime()) && 
            await _eventoRepository.ExisteEventoEnLugarYFechaAsync(dto.Lugar, dto.FechaEvento))
        {
             throw new InvalidOperationException("¡Ya existe un evento registrado en este lugar y fecha!");
        }

        eventoExistente.Titulo = dto.Titulo;
        eventoExistente.Descripcion = dto.Descripcion;
        eventoExistente.Lugar = dto.Lugar;
        eventoExistente.FechaEvento = dto.FechaEvento.ToUniversalTime();
        eventoExistente.Precio = dto.Precio;
        eventoExistente.CapacidadMaxima = dto.CapacidadMaxima;
        eventoExistente.IdEmpresa = dto.IdEmpresa;

        // No actualizamos el Id ni el navigation property directamente
        
        await _eventoRepository.UpdateAsync(eventoExistente);
    }
}
