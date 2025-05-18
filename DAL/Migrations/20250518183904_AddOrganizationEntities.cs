using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PostComments");

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                table: "Services",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                table: "Jobs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<byte[]>(
                name: "ImageData",
                table: "BlogPosts",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ImageContentType",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Organizations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Industry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationUsers",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationUsers", x => new { x.OrganizationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_OrganizationUsers_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Services_OrganizationId",
                table: "Services",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_OrganizationId",
                table: "Jobs",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationUsers_UserId",
                table: "OrganizationUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Organizations_OrganizationId",
                table: "Jobs",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Organizations_OrganizationId",
                table: "Services",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Organizations_OrganizationId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Services_Organizations_OrganizationId",
                table: "Services");

            migrationBuilder.DropTable(
                name: "OrganizationUsers");

            migrationBuilder.DropTable(
                name: "Organizations");

            migrationBuilder.DropIndex(
                name: "IX_Services_OrganizationId",
                table: "Services");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_OrganizationId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Jobs");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "PostComments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<byte[]>(
                name: "ImageData",
                table: "BlogPosts",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ImageContentType",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
