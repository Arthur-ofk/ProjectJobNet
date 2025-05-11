using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.Services.Abstractins;
using DAL.Models;
using System;
using System.Threading.Tasks;

namespace ProjectJobNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IServiceService _serviceService;

        public OrderController(IOrderService orderService, IServiceService serviceService)
        {
            _orderService = orderService;
            _serviceService = serviceService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            // Ensure the service exists
            var service = await _serviceService.GetServiceByIdAsync(order.ServiceId);
            if (service == null) 
                return NotFound("Service not found");
            
            // Set required properties
            order.Id = Guid.NewGuid();
            order.AuthorId = service.UserId; // Service author becomes the order author
            order.Status = "Pending";
            order.CreatedAt = DateTime.UtcNow;
            order.Message = order.Message ?? string.Empty;  // ensure Message is not null

            var result = await _orderService.PlaceOrderAsync(order);
            if (result == null)
                return StatusCode(500, "Failed to place order");
            return Ok(result);
        }

        [HttpGet("author/{authorId}")]
        [Authorize]
        public async Task<IActionResult> GetOrdersForAuthor(Guid authorId)
        {
            var orders = await _orderService.GetOrdersForAuthorAsync(authorId);
            return Ok(orders);
        }

        [HttpGet("customer/{customerId}")]
        [Authorize]
        public async Task<IActionResult> GetOrdersForCustomer(Guid customerId)
        {
            var orders = await _orderService.GetOrdersForCustomerAsync(customerId);
            return Ok(orders);
        }

        [HttpPost("{orderId}/accept")]
        [Authorize]
        public async Task<IActionResult> AcceptOrder(Guid orderId)
        {
            var result = await _orderService.AcceptOrderAsync(orderId);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPost("{orderId}/refuse")]
        [Authorize]
        public async Task<IActionResult> RefuseOrder(Guid orderId)
        {
            var result = await _orderService.RefuseOrderAsync(orderId);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpPost("{orderId}/confirm")]
        [Authorize]
        public async Task<IActionResult> ConfirmOrder(Guid orderId, [FromBody] string role)
        {
            var result = await _orderService.ConfirmOrderAsync(orderId, role);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpGet("notifications/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetNotifications(Guid userId)
        {
            var orders = await _orderService.GetOrdersForUserAsync(userId);
            return Ok(orders);
        }
    }
}
