using System;

namespace DAL.Models
{
    public class OrganizationUser
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        
        public Guid OrganizationId { get; set; }
        public Organization Organization { get; set; }
        
        public string Role { get; set; } // "Owner", "Admin", "Member"
        public DateTime JoinedAt { get; set; }
    }
}
