using BLL.Services.Abstractins;
using BLL.Shared.SubscriptionPlan;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionPlanController : ControllerBase
    {
        private readonly ISubscriptionPlanService _subscriptionPlanService;

        public SubscriptionPlanController(ISubscriptionPlanService subscriptionPlanService)
        {
            _subscriptionPlanService = subscriptionPlanService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionPlanDto>>> GetAllSubscriptionPlans()
        {
            var plans = await _subscriptionPlanService.GetAllSubscriptionPlansAsync();
            return Ok(plans);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubscriptionPlanDto>> GetSubscriptionPlanById(Guid id)
        {
            var plan = await _subscriptionPlanService.GetSubscriptionPlanByIdAsync(id);
            if (plan == null)
                return NotFound();

            return Ok(plan);
        }

        [HttpPost]
        public async Task<IActionResult> AddSubscriptionPlan([FromBody] CreateSubscriptionPlanDto createSubscriptionPlanDto)
        {
            await _subscriptionPlanService.AddSubscriptionPlanAsync(createSubscriptionPlanDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscriptionPlan(Guid id, [FromBody] CreateSubscriptionPlanDto updateSubscriptionPlanDto)
        {
            await _subscriptionPlanService.UpdateSubscriptionPlanAsync(id, updateSubscriptionPlanDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriptionPlan(Guid id)
        {
            await _subscriptionPlanService.DeleteSubscriptionPlanAsync(id);
            return NoContent();
        }
    }
}
