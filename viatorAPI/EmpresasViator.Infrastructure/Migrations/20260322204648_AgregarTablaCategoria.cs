using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTablaCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoriaId",
                table: "Empresas",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "idCategoria",
                table: "Empresas",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_CategoriaId",
                table: "Empresas",
                column: "CategoriaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Empresas_Categorias_CategoriaId",
                table: "Empresas",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empresas_Categorias_CategoriaId",
                table: "Empresas");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Empresas_CategoriaId",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "idCategoria",
                table: "Empresas");
        }
    }
}
