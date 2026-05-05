using Microsoft.AspNetCore.Mvc;
using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Interfaces;

namespace EmpresasViator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    private readonly IRegistrarEventoUseCase _registrarEventoUseCase;
    private readonly IObtenerEventosUseCase _obtenerEventosUseCase;
    private readonly IUpdateEventoUseCase _updateEventoUseCase;
    private readonly IDeleteEventoUseCase _deleteEventoUseCase;

    public EventoController(IRegistrarEventoUseCase registrarEventoUseCase, IObtenerEventosUseCase obtenerEventosUseCase, IUpdateEventoUseCase updateEventoUseCase,
        IDeleteEventoUseCase deleteEventoUseCase)
    {
        _registrarEventoUseCase = registrarEventoUseCase;
        _obtenerEventosUseCase = obtenerEventosUseCase;
        _updateEventoUseCase = updateEventoUseCase;
        _deleteEventoUseCase = deleteEventoUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> RegistrarEvento([FromBody] CreateEventoDto dto)
    {
        try
        {
            Guid idNuevo = await _registrarEventoUseCase.ExecuteAsync(dto);
            
            return CreatedAtAction(nameof(RegistrarEvento), new { id = idNuevo }, new { id = idNuevo });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al registrar el evento.", details = ex.Message });
        }
    }

    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            var eventos = await _obtenerEventosUseCase.ExecuteAsync();
            return Ok(eventos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al obtener los eventos.", details = ex.Message });
        }
    }

    [HttpPut]
    [Route("Update/{id}")]
    public async Task<IActionResult> UpdateEvento(Guid id, [FromBody] CreateEventoDto dto)
    {
        try
        {
            await _updateEventoUseCase.ExecuteAsync(id, dto);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al actualizar el evento.", details = ex.Message });
        }
    }

    [HttpDelete]
    [Route("Delete/{id}")]
    public async Task<IActionResult> DeleteEvento(Guid id)
    {
        try
        {
            await _deleteEventoUseCase.ExecuteAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al eliminar el evento.", details = ex.Message });
        }
    }
}
