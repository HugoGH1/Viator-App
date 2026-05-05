namespace EmpresasViator.Application.Interfaces;

public interface IDeleteEventoUseCase
{
    Task ExecuteAsync(Guid id);
}
