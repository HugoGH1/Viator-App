using Microsoft.AspNetCore.Mvc;
using EmpresasViator.Application.dtos;
using EmpresasViator.Application.Interfaces;

namespace EmpresasViator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmpresaController : ControllerBase
{
    private readonly IRegistrarEmpresaUseCase _registrarEmpresaUseCase;
    private readonly IObtenerEmpresasUseCase _obtenerEmpresasUseCase;
    private readonly IObtenerEmpresaPorIdUseCase _obtenerEmpresaPorIdUseCase;
    private readonly IUpdateEmpresaUseCase _updateEmpresaUseCase;
    private readonly IDeleteEmpresaUseCase _deleteEmpresaUseCase;

    public EmpresaController(IRegistrarEmpresaUseCase registrarEmpresaUseCase, IObtenerEmpresasUseCase obtenerEmpresasUseCase, 
        IObtenerEmpresaPorIdUseCase obtenerEmpresaPorIdUseCase, IUpdateEmpresaUseCase updateEmpresaUseCase,
        IDeleteEmpresaUseCase deleteEmpresaUseCase)
    {
        _registrarEmpresaUseCase = registrarEmpresaUseCase;
        _obtenerEmpresasUseCase = obtenerEmpresasUseCase;
        _obtenerEmpresaPorIdUseCase = obtenerEmpresaPorIdUseCase;
        _updateEmpresaUseCase = updateEmpresaUseCase;
        _deleteEmpresaUseCase = deleteEmpresaUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> RegistrarEmpresa([FromBody] CreateEmpresaDto dto)
    {
        try
        {
            Guid idNuevo = await _registrarEmpresaUseCase.ExecuteAsync(dto);

            return CreatedAtAction(nameof(RegistrarEmpresa), new { id = idNuevo }, new { id = idNuevo });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al registrar la empresa.", details = ex.Message });
        }
    }

    [HttpGet]
    [Route("Empresas")]
    public async Task<IActionResult> GetAllAsync()
    {
        try
        {
            var empresas = await _obtenerEmpresasUseCase.ExecuteAsync();
            return Ok(empresas);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al obtener las empresas.", details = ex.Message });
        }
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        try
        {
            var empresa = await _obtenerEmpresaPorIdUseCase.ExecuteAsync(id);
            return Ok(empresa);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al obtener la empresa.", details = ex.Message });
        }
    }

    [HttpPut]
    [Route("Update/{id}")]
    public async Task<IActionResult> UpdateEmpresa(Guid id, [FromBody] CreateEmpresaDto dto)
    {
        try
        {
            await _updateEmpresaUseCase.ExecuteAsync(id, dto);
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
    }

    [HttpDelete]
    [Route("Delete/{id}")]
    public async Task<IActionResult> DeleteEmpresa(Guid id)
    {
        try
        {
            await _deleteEmpresaUseCase.ExecuteAsync(id);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
