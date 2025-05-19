using BLL.Services.Abstractins;
using BLL.Shared.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpPost]
        public async Task<IActionResult> AddService([FromBody] CreateServiceDto createServiceDto)
        {
            await _serviceService.AddServiceAsync(createServiceDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] CreateServiceDto updateServiceDto)
        {
            await _serviceService.UpdateServiceAsync(id, updateServiceDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            await _serviceService.DeleteServiceAsync(id);
            return NoContent();
        }

        [HttpGet("{id}/hasUsed")]
        public async Task<ActionResult<bool>> HasUserUsedService(Guid id, [FromQuery] Guid userId)
        {
            bool hasUsed = await _serviceService.HasUserUsedService(id, userId);
            return Ok(hasUsed);
        }

        // New endpoint for voting on a service
        [HttpPost("{id}/vote")]
        public async Task<IActionResult> VoteService(Guid id, [FromBody] bool isUpvote)
        {
            // Extract the current user id from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();
            Guid userId = Guid.Parse(userIdClaim);

            bool result = await _serviceService.VoteServiceAsync(id, userId, isUpvote);
            if (!result)
                return BadRequest("Voting failed: either you've already voted this way or you haven't used the service.");
            return Ok();
        }

        // GET: api/services/organization/{organizationId}
        [AllowAnonymous]
        [HttpGet("organization/{organizationId}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByOrganization(Guid organizationId)
        {
            try
            {
                var services = await _serviceService.GetServicesByOrganizationIdAsync(organizationId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving services: {ex.Message}");
            }
        }
    }
}
