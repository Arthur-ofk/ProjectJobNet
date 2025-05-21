using System;

namespace BLL.Shared.Organization
{
    public class AddUserDto
    {
        public Guid UserId { get; set; }
        public Guid OrganizationId { get; set; }
        public string Role { get; set; } = "Member"; // Default role
    }
}
