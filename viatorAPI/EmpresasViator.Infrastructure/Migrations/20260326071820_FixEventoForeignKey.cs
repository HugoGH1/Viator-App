using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmpresasViator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixEventoForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Empresas_EmpresaId",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_EmpresaId",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "Eventos");

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_IdEmpresa",
                table: "Eventos",
                column: "IdEmpresa");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Empresas_IdEmpresa",
                table: "Eventos",
                column: "IdEmpresa",
                principalTable: "Empresas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Empresas_IdEmpresa",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_IdEmpresa",
                table: "Eventos");

            migrationBuilder.AddColumn<Guid>(
                name: "EmpresaId",
                table: "Eventos",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_EmpresaId",
                table: "Eventos",
                column: "EmpresaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Empresas_EmpresaId",
                table: "Eventos",
                column: "EmpresaId",
                principalTable: "Empresas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
