namespace EmpresasViator.Application.Interfaces;

public interface IDeleteEmpresaUseCase
{
    Task ExecuteAsync(Guid id);
}