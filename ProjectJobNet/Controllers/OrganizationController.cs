using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.Services.Abstractins;
using BLL.Shared.Organization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json; // Use System.Text.Json instead of Newtonsoft
using System.Security.Claims; // Add this namespace for ClaimTypes

namespace ProjectJobNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationService _organizationService;
        private readonly IServiceService _serviceService;
        private readonly IJobService _jobService;

        public OrganizationController(
            IOrganizationService organizationService, 
            IServiceService serviceService,
            IJobService jobService)
        {
            _organizationService = organizationService;
            _serviceService = serviceService;
            _jobService = jobService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetAll()
        {
            var orgs = await _organizationService.GetAllOrganizationsAsync();
            return Ok(orgs);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<OrganizationDto>> GetById(Guid id)
        {
            try
            {
                var org = await _organizationService.GetOrganizationByIdAsync(id);
                if (org == null)
                    return NotFound();
                return Ok(org);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting organization: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetUserOrganizations(Guid userId)
        {
            try
            {
                var organizations = await _organizationService.GetOrganizationsByUserIdAsync(userId);
                return Ok(organizations);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting organizations: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrganizationDto>> Create([FromBody] CreateOrganizationDto dto)
        {
            try
            {
                // Log the incoming data
                System.Diagnostics.Debug.WriteLine($"Creating organization: {JsonSerializer.Serialize(dto)}");
                
                // If no owner specified, use the current user
                if (dto.OwnerUserId == Guid.Empty)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim == null)
                        return Unauthorized("User ID not found in token");
                        
                    dto.OwnerUserId = Guid.Parse(userIdClaim.Value);
                }
                
                // Validate required fields
                if (string.IsNullOrEmpty(dto.Name))
                    return BadRequest("Organization name is required");
                
                var org = await _organizationService.CreateOrganizationAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = org.Id }, org);
            }
            catch (Exception ex)
            {
                // Log the full exception
                System.Diagnostics.Debug.WriteLine($"Error creating organization: {ex}");
                return BadRequest($"Error creating organization: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOrganizationDto dto)
        {
            try
            {
                // Verify if user is owner or admin
                var orgMembers = await _organizationService.GetOrganizationMembersAsync(id);
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("Invalid user ID format");
                
                bool isAuthorized = false;
                foreach (var member in orgMembers)
                {
                    if (member.UserId == userId && (member.Role == "Owner" || member.Role == "Admin"))
                    {
                        isAuthorized = true;
                        break;
                    }
                }
                
                if (!isAuthorized)
                    return Forbid("Only organization owners and admins can update organization details");
                
                await _organizationService.UpdateOrganizationAsync(id, dto);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                // Verify if user is owner
                var orgMembers = await _organizationService.GetOrganizationMembersAsync(id);
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("Invalid user ID format");
                
                bool isOwner = false;
                foreach (var member in orgMembers)
                {
                    if (member.UserId == userId && member.Role == "Owner")
                    {
                        isOwner = true;
                        break;
                    }
                }
                
                if (!isOwner)
                    return Forbid("Only organization owners can delete organizations");
                
                await _organizationService.DeleteOrganizationAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/members")]
        public async Task<ActionResult<IEnumerable<OrganizationUserDto>>> GetMembers(Guid id)
        {
            try
            {
                var members = await _organizationService.GetOrganizationMembersAsync(id);
                return Ok(members);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("members")]
        public async Task<IActionResult> AddMember([FromBody] AddUserToOrganizationDto dto)
        {
            try
            {
                // Verify if user is owner or admin
                var orgMembers = await _organizationService.GetOrganizationMembersAsync(dto.OrganizationId);
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("Invalid user ID format");
                
                bool isAuthorized = false;
                foreach (var member in orgMembers)
                {
                    if (member.UserId == userId && (member.Role == "Owner" || member.Role == "Admin"))
                    {
                        isAuthorized = true;
                        break;
                    }
                }
                
                if (!isAuthorized)
                    return Forbid("Only organization owners and admins can add members");
                
                await _organizationService.AddUserToOrganizationAsync(dto);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{orgId}/members/{userId}")]
        public async Task<IActionResult> RemoveMember(Guid orgId, Guid userId)
        {
            try
            {
                // Verify if current user is owner or admin
                var orgMembers = await _organizationService.GetOrganizationMembersAsync(orgId);
                var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim.Value, out var currentUserId))
                    return BadRequest("Invalid user ID format");
                
                bool isAuthorized = false;
                foreach (var member in orgMembers)
                {
                    if (member.UserId == currentUserId && (member.Role == "Owner" || member.Role == "Admin"))
                    {
                        isAuthorized = true;
                        break;
                    }
                }
                
                if (!isAuthorized)
                    return Forbid("Only organization owners and admins can remove members");
                
                await _organizationService.RemoveUserFromOrganizationAsync(orgId, userId);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{orgId}/members/{userId}/role")]
        public async Task<ActionResult<OrganizationUserDto>> UpdateMemberRole(Guid orgId, Guid userId, [FromBody] string role)
        {
            try
            {
                // Verify if current user is owner
                var orgMembers = await _organizationService.GetOrganizationMembersAsync(orgId);
                var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim.Value, out var currentUserId))
                    return BadRequest("Invalid user ID format");
                
                bool isOwner = false;
                foreach (var member in orgMembers)
                {
                    if (member.UserId == currentUserId && member.Role == "Owner")
                    {
                        isOwner = true;
                        break;
                    }
                }
                
                if (!isOwner)
                    return Forbid("Only organization owners can change member roles");
                
                var updatedMember = await _organizationService.UpdateUserRoleAsync(orgId, userId, role);
                return Ok(updatedMember);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
