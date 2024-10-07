using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.DataAccessLayer.Services;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderDL _orderDL;

        public OrderController(IOrderDL orderDL)
        {
            _orderDL = orderDL;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            var (created, message) = await _orderDL.CreateOrder(order);
            if (created)
            {
                return Ok(new { Message = message, Product = order });
            }
            else
            {
                return BadRequest(new { Message = message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var order = await _orderDL.GetOrderById(orderId);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderDL.GetAllOrders();
            return Ok(orders);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            var updated = await _orderDL.UpdateOrder(order);
            if (updated)
            {
                return Ok("Order updated successfully.");
            }
            return BadRequest("Failed to update order.");
        }

        [HttpPut]
        public async Task<IActionResult> CancelOrder(string orderId, [FromQuery] string reason)
        {
            var canceled = await _orderDL.CancelOrder(orderId, reason);
            if (canceled)
            {
                return Ok("Order cancelled successfully.");
            }
            return BadRequest("Failed to cancel order.");
        }
    }
}
