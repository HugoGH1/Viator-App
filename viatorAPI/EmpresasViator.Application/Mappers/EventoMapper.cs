using EmpresasViator.Application.dtos;
using EmpresasViator.Domain.Entities;

namespace EmpresasViator.Application.Mappers;

public static class EventoMapper
{
    public static Evento ToEntity(this CreateEventoDto dto)
    {
        return new Evento
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            Lugar = dto.Lugar,
            FechaEvento = dto.FechaEvento.ToUniversalTime(),
            Precio = dto.Precio,
            CapacidadMaxima = dto.CapacidadMaxima,
            IdEmpresa = dto.IdEmpresa
        };
    }
}
