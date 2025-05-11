using BLL.Services.Abstractins;
using BLL.Shared.Subscription;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionDto>>> GetAllSubscriptions()
        {
            var subscriptions = await _subscriptionService.GetAllSubscriptionsAsync();
            return Ok(subscriptions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubscriptionDto>> GetSubscriptionById(Guid id)
        {
            var subscription = await _subscriptionService.GetSubscriptionByIdAsync(id);
            if (subscription == null)
                return NotFound();

            return Ok(subscription);
        }

        [HttpPost]
        public async Task<IActionResult> AddSubscription([FromBody] CreateSubscriptionDto createSubscriptionDto)
        {
            await _subscriptionService.AddSubscriptionAsync(createSubscriptionDto);
            return CreatedAtAction(nameof(GetSubscriptionById), new { id = createSubscriptionDto }, createSubscriptionDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscription(Guid id, [FromBody] CreateSubscriptionDto updateSubscriptionDto)
        {
            await _subscriptionService.UpdateSubscriptionAsync(id, updateSubscriptionDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(Guid id)
        {
            await _subscriptionService.DeleteSubscriptionAsync(id);
            return NoContent();
        }
    }
}
