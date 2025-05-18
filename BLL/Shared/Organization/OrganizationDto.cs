using System;
using System.Collections.Generic;

namespace BLL.Shared.Organization
{
    public class OrganizationDto
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
    }
}
