using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Complaint
{
    public class CreateComplaintDto
    {

        public Guid ComplainantId { get; set; }
        public Guid TargetPostId { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
