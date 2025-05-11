using BLL.Services.Abstractins;
using BLL.Shared.Order;
using DAL.Abstractions;
using DAL.Models;
using System.Linq;

namespace BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<Order?> PlaceOrderAsync(Order order)
        {
            await _unitOfWork.OrderRepository.AddAsync(order);
            await _unitOfWork.CompleteAsync();
            return order;
        }
        public async Task<bool> AcceptOrderAsync(Guid orderId)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
            if(order == null) return false;
            order.Status = "Accepted";
            order.AcceptedAt = DateTime.UtcNow;
            await _unitOfWork.CompleteAsync();
            return true;
        }
        public async Task<bool> RefuseOrderAsync(Guid orderId)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
            if(order == null) return false;
            order.Status = "Refused";
            await _unitOfWork.CompleteAsync();
            return true;
        }
        public async Task<bool> ConfirmOrderAsync(Guid orderId, string role)
        {
            var order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
            if(order == null) return false;
            
            if(role.ToLower() == "author")
                order.AuthorConfirmed = true;
            else if(role.ToLower() == "customer")
                order.CustomerConfirmed = true;
            
            if(order.AuthorConfirmed && order.CustomerConfirmed)
            {
                order.Status = "Finished"; // Now order is marked finished and ready for rating
                order.CompletedAt = DateTime.UtcNow;
                // Optionally trigger notifications that the order is finished and available for review/upvote.
            }
            
            await _unitOfWork.CompleteAsync();
            return true;
        }
        public async Task<IEnumerable<OrderDto>> GetOrdersForAuthorAsync(Guid authorId)
        {
            var orders = await _unitOfWork.OrderRepository.FindAsync(o => o.AuthorId == authorId);
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                ServiceId = o.ServiceId,
                AuthorId = o.AuthorId,
                CustomerId = o.CustomerId,
                Status = o.Status,
                AuthorConfirmed = o.AuthorConfirmed,
                CustomerConfirmed = o.CustomerConfirmed,
                CreatedAt = o.CreatedAt,
                AcceptedAt = o.AcceptedAt,
                CompletedAt = o.CompletedAt,
                Message = o.Message
            });
        }
        public async Task<IEnumerable<OrderDto>> GetOrdersForCustomerAsync(Guid customerId)
        {
            // Return all orders for the given customer
            var orders = await _unitOfWork.OrderRepository.FindAsync(o => o.CustomerId == customerId);
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                ServiceId = o.ServiceId,
                AuthorId = o.AuthorId,
                CustomerId = o.CustomerId,
                Status = o.Status,
                AuthorConfirmed = o.AuthorConfirmed,
                CustomerConfirmed = o.CustomerConfirmed,
                CreatedAt = o.CreatedAt,
                AcceptedAt = o.AcceptedAt,
                CompletedAt = o.CompletedAt,
                Message = o.Message
            });
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersForUserAsync(Guid userId)
        {
            var orders = await _unitOfWork.OrderRepository.FindAsync(o => o.AuthorId == userId || o.CustomerId == userId);
            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                ServiceId = o.ServiceId,
                AuthorId = o.AuthorId,
                CustomerId = o.CustomerId,
                Status = o.Status,
                AuthorConfirmed = o.AuthorConfirmed,
                CustomerConfirmed = o.CustomerConfirmed,
                CreatedAt = o.CreatedAt,
                AcceptedAt = o.AcceptedAt,
                CompletedAt = o.CompletedAt,
                Message = o.Message
            });
        }
    }
}
