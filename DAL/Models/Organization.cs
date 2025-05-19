using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Organization
    {
        public Guid Id { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public string Industry { get; set; }
        
        public string Website { get; set; }
        
        public string Address { get; set; }
        
        // Profile image fields - storing directly in DB
        public byte[]? LogoImageData { get; set; }
        public string? LogoImageContentType { get; set; }
        
        // Original URL field - keep for backward compatibility
        public string? LogoUrl { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<OrganizationUser> Members { get; set; }
        public ICollection<Job> Jobs { get; set; }
        public ICollection<Service> Services { get; set; }
    }
}
