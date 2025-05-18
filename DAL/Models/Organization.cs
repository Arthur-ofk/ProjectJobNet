using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Organization
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string Website { get; set; }
        public string Address { get; set; }
        public string LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Navigation properties
        public ICollection<OrganizationUser> Members { get; set; }
        public ICollection<Job> Jobs { get; set; }
        public ICollection<Service> Services { get; set; }
    }
}
