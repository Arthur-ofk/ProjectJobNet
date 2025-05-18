using System;

namespace BLL.Shared.Organization
{
    public class UpdateOrganizationDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string Website { get; set; }
        public string Address { get; set; }
        public string LogoUrl { get; set; }
    }
}
