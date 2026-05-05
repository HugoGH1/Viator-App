using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarIndicesUnicos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Empresas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    idAdmin = table.Column<string>(type: "text", nullable: true),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    RFC = table.Column<string>(type: "text", nullable: false),
                    Calle = table.Column<string>(type: "text", nullable: false),
                    NumExt = table.Column<string>(type: "text", nullable: false),
                    NumInt = table.Column<string>(type: "text", nullable: true),
                    Colonia = table.Column<string>(type: "text", nullable: false),
                    Ciudad = table.Column<string>(type: "text", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false),
                    CodigoPostal = table.Column<string>(type: "text", nullable: false),
                    Telefono = table.Column<string>(type: "text", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Eventos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Lugar = table.Column<string>(type: "text", nullable: false),
                    FechaEvento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Precio = table.Column<decimal>(type: "numeric", nullable: false),
                    CapacidadMaxima = table.Column<int>(type: "integer", nullable: false),
                    IdEmpresa = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Eventos_Empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "Empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_RFC",
                table: "Empresas",
                column: "RFC",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_EmpresaId",
                table: "Eventos",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_Lugar_FechaEvento",
                table: "Eventos",
                columns: new[] { "Lugar", "FechaEvento" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Eventos");

            migrationBuilder.DropTable(
                name: "Empresas");
        }
    }
}
