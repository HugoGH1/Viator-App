using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategorias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categorias",
                columns: new[] { "Id", "Descripcion", "Nombre" },
                values: new object[,]
                {
                    { new Guid("550e8400-e29b-41d4-a716-446655440000"), "Servicios de venta de productos", "Servicios" },
                    { new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"), "Establecimientos de eventos", "Entretenimiento" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categorias",
                keyColumn: "Id",
                keyValue: new Guid("550e8400-e29b-41d4-a716-446655440000"));

            migrationBuilder.DeleteData(
                table: "Categorias",
                keyColumn: "Id",
                keyValue: new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"));
        }
    }
}
