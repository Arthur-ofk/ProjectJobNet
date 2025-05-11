using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.SubscriptionPlan
{
    public class CreateSubscriptionPlanDto
    {
        public string PlanName { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; } // у днях або місяцях, залежить від логіки
    }
}
