using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Warning
{
    public class WarningDto
    {
        public Guid Id { get; set; }
        public Guid ModeratorId { get; set; }
        public Guid UserId { get; set; }
        public Guid ComplaintId { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
