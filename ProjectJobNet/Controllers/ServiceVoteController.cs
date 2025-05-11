using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.Services.Abstractins;
using System;
using System.Threading.Tasks;

namespace ProjectJobNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceVoteController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceVoteController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetVote([FromQuery] Guid serviceId, [FromQuery] Guid userId)
        {
            var vote = await _serviceService.GetUserVoteAsync(serviceId, userId);
            return Ok(vote);
        }
    }
}
