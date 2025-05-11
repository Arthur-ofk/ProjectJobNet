using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Job
{
    public class UpdateJobDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Salary { get; set; }
        public string Location { get; set; }
        public Guid CategoryId { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
