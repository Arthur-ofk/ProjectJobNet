using System;

namespace BLL.Shared.Organization
{
    public class OrganizationUserDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public Guid OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string Role { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
