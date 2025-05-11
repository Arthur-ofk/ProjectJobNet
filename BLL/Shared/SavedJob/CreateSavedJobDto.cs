using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.SavedJob
{
    public class CreateSavedJobDto
    {
        public Guid EmployerId { get; set; }
        public Guid JobId { get; set; }
    }
}
