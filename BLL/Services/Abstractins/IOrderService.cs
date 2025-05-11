using BLL.Shared.Order;

namespace BLL.Services.Abstractins
{
    public interface IOrderService
    {
        Task<Order?> PlaceOrderAsync(Order order);
        Task<bool> AcceptOrderAsync(Guid orderId);
        Task<bool> RefuseOrderAsync(Guid orderId);
        Task<bool> ConfirmOrderAsync(Guid orderId, string role);
        Task<IEnumerable<OrderDto>> GetOrdersForAuthorAsync(Guid authorId);
        Task<IEnumerable<OrderDto>> GetOrdersForCustomerAsync(Guid customerId);
        Task<IEnumerable<OrderDto>> GetOrdersForUserAsync(Guid userId);
    }
}
