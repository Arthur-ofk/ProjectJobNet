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
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public string Message { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public DateTime SentAt { get; set; }
    }
}
