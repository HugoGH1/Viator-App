using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarImagenesAEmpresa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "GaleriaImagenes",
                table: "Empresas",
                type: "text[]",
                nullable: false,
                defaultValue: new string[] {});

            migrationBuilder.AddColumn<string>(
                name: "ImagenPortada",
                table: "Empresas",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GaleriaImagenes",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "ImagenPortada",
                table: "Empresas");
        }
    }
}
