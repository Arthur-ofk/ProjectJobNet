using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Service
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; } // nullable
        public string? ServiceName { get; set; } // nullable
        public string? Description { get; set; } // nullable
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; } // nullable
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<ServiceTag> ServiceTags { get; set; } = new List<ServiceTag>(); // default empty list
    }
}
