using BLL.Shared.SubscriptionPlan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ISubscriptionPlanService
    {
        Task<IEnumerable<SubscriptionPlanDto>> GetAllSubscriptionPlansAsync();
        Task<SubscriptionPlanDto> GetSubscriptionPlanByIdAsync(Guid id);
        Task AddSubscriptionPlanAsync(CreateSubscriptionPlanDto createSubscriptionPlanDto);
        Task UpdateSubscriptionPlanAsync(Guid id, CreateSubscriptionPlanDto updateSubscriptionPlanDto);
        Task DeleteSubscriptionPlanAsync(Guid id);
    }
}
