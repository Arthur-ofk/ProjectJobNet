using System;
using System.ComponentModel.DataAnnotations;

namespace BLL.Shared.Organization
{
    public class CreateOrganizationDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
        
        [StringLength(1000)]
        public string Description { get; set; }
        
        [StringLength(100)]
        public string Industry { get; set; }
        
        [StringLength(200)]
        public string Website { get; set; }
        
        [StringLength(300)]
        public string Address { get; set; }
        
        [StringLength(500)]
        public string LogoUrl { get; set; }
        
        public Guid OwnerUserId { get; set; }
    }
}
