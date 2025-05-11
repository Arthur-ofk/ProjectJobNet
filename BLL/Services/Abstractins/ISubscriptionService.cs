using BLL.Shared.Subscription;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Abstractins
{
    public interface ISubscriptionService
    {
        Task<IEnumerable<SubscriptionDto>> GetAllSubscriptionsAsync();
        Task<SubscriptionDto> GetSubscriptionByIdAsync(Guid id);
        Task AddSubscriptionAsync(CreateSubscriptionDto createSubscriptionDto);
        Task UpdateSubscriptionAsync(Guid id, CreateSubscriptionDto updateSubscriptionDto);
        Task DeleteSubscriptionAsync(Guid id);
    }
}
