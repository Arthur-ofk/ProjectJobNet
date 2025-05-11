using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class SubscriptionPlan
    {
        public Guid Id { get; set; }
        public string PlanName { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; } // в днях
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Subscription> Subscriptions { get; set; }
    }
}
