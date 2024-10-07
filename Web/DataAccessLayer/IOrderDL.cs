using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer
{
    public interface IOrderDL
    {
        Task<(bool created, string message)> CreateOrder(Order order);
        Task<Order> GetOrderById(string orderId);
        Task<List<Order>> GetAllOrders();
        Task<bool> UpdateOrder(Order order);
        Task<bool> CancelOrder(string orderId, string cancellationReason);
    }
}
