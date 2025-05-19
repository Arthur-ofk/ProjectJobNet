using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable enable

namespace DAL.Migrations
{
    // This migration adds the appropriate columns to both tables
    public partial class AddProfileImageFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ProfileImageData",
                table: "Users",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageContentType",
                table: "Users",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "LogoImageData",
                table: "Organizations",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoImageContentType",
                table: "Organizations",
                type: "nvarchar(100)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageData",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProfileImageContentType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LogoImageData",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "LogoImageContentType",
                table: "Organizations");
        }
    }
}
