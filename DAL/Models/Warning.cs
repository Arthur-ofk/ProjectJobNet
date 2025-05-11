using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Warning
    {
        public Guid Id { get; set; }
        public Guid ModeratorId { get; set; }
        public User Moderator { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid ComplaintId { get; set; }
        public Complaint Complaint { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
