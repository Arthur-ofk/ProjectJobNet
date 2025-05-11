using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Abstractions;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderRepository _orderRepo;
    private readonly IServiceRepository _serviceRepo;

    public OrderController(IOrderRepository orderRepo, IServiceRepository serviceRepo)
    {
        _orderRepo = orderRepo;
        _serviceRepo = serviceRepo;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> PlaceOrder([FromBody] Order order)
    {
        var service = await _serviceRepo.GetByIdAsync(order.ServiceId);
        if (service == null) return NotFound();
        order.Id = Guid.NewGuid();
        order.AuthorId = service.UserId;
        order.Status = "Pending";
        order.CreatedAt = DateTime.UtcNow;
        await _orderRepo.AddAsync(order);
        await _orderRepo.UnitOfWork.CompleteAsync();
        return Ok(order);
    }

    [HttpGet("author/{authorId}")]
    [Authorize]
    public async Task<IActionResult> GetOrdersForAuthor(Guid authorId)
    {
        var orders = await _orderRepo.FindAsync(o => o.AuthorId == authorId);
        return Ok(orders);
    }

    [HttpGet("customer/{customerId}")]
    [Authorize]
    public async Task<IActionResult> GetOrdersForCustomer(Guid customerId)
    {
        var orders = await _orderRepo.FindAsync(o => o.CustomerId == customerId);
        return Ok(orders);
    }

    [HttpPost("{orderId}/accept")]
    [Authorize]
    public async Task<IActionResult> AcceptOrder(Guid orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null) return NotFound();
        order.Status = "Accepted";
        order.AcceptedAt = DateTime.UtcNow;
        await _orderRepo.UnitOfWork.CompleteAsync();
        return Ok(order);
    }

    [HttpPost("{orderId}/refuse")]
    [Authorize]
    public async Task<IActionResult> RefuseOrder(Guid orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null) return NotFound();
        order.Status = "Refused";
        await _orderRepo.UnitOfWork.CompleteAsync();
        return Ok(order);
    }

    [HttpPost("{orderId}/confirm")]
    [Authorize]
    public async Task<IActionResult> ConfirmOrder(Guid orderId, [FromBody] string role)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null) return NotFound();
        if (role == "author") order.AuthorConfirmed = true;
        if (role == "customer") order.CustomerConfirmed = true;
        if (order.AuthorConfirmed && order.CustomerConfirmed)
        {
            order.Status = "Confirmed";
            order.CompletedAt = DateTime.UtcNow;
        }
        await _orderRepo.UnitOfWork.CompleteAsync();
        return Ok(order);
    }
}
