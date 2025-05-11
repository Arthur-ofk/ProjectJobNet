using DAL.Abstractions;
using DAL.Context;
using DAL.Models;
using DAL.Repos;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(JobNetContext context) : base(context) { }
}
