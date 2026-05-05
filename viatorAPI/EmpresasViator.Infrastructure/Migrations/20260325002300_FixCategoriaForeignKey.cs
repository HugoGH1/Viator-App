using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCategoriaForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empresas_Categorias_CategoriaId",
                table: "Empresas");

            migrationBuilder.DropIndex(
                name: "IX_Empresas_CategoriaId",
                table: "Empresas");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Empresas");

            migrationBuilder.CreateIndex(
                name: "IX_Empresas_idCategoria",
                table: "Empresas",
                column: "idCategoria");

            migrationBuilder.AddForeignKey(
                name: "FK_Empresas_Categorias_idCategoria",
                table: "Empresas",
                column: "idCategoria",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Empresas_Categorias_idCategoria",
                table: "Empresas");

            migrationBuilder.DropIndex(
                name: "IX_Empresas_idCategoria",
                table: "Empresas");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoriaId",
                table: "Empresas",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
