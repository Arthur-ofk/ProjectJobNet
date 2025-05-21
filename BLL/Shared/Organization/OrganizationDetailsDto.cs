using BLL.Shared.Job;
using BLL.Shared.Service;
using System;
using System.Collections.Generic;

namespace BLL.Shared.Organization
{
    public class OrganizationDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid OwnerUserId { get; set; }
        public List<ServiceDto> Services { get; set; }
        public List<JobDto> Jobs { get; set; }
    }
}
