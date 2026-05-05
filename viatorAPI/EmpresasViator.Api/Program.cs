using Microsoft.EntityFrameworkCore;
using EmpresasViator.Infrastructure.Context;
using EmpresasViator.Domain.Repositories;
using EmpresasViator.Infrastructure.Repositories;
using EmpresasViator.Application.Interfaces;
using EmpresasViator.Application.UseCases;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

//Inyección de Dependencias
builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<IRegistrarEmpresaUseCase, RegistrarEmpresaUseCase>();
builder.Services.AddScoped<IObtenerEmpresasUseCase, ObtenerEmpresasUseCase>();
builder.Services.AddScoped<IObtenerEmpresaPorIdUseCase, ObtenerEmpresaPorIdUseCase>();
builder.Services.AddScoped<IUpdateEmpresaUseCase, UpdateEmpresaUseCase>();
builder.Services.AddScoped<IDeleteEmpresaUseCase, DeleteEmpresaUseCase>();

// Evento DI
builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<IRegistrarEventoUseCase, RegistrarEventoUseCase>();
builder.Services.AddScoped<IObtenerEventosUseCase, ObtenerEventosUseCase>();
builder.Services.AddScoped<IUpdateEventoUseCase, UpdateEventoUseCase>();
builder.Services.AddScoped<IDeleteEventoUseCase, DeleteEventoUseCase>();
// Base de Datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

var app = builder.Build();

// Aplica migraciones pendientes automáticamente al iniciar el contenedor
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.UseCors("AllowAll");
app.Run();