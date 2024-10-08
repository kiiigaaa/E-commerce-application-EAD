/**************************************************************************
 * File:        OrderController.cs
 * Author:      Hansani
 * Date:        20241006
 * Description: This controller handles the order-related API endpoints, including creating,
//              retrieving, updating, and canceling orders. It utilizes dependency injection to 
//              access the data layer services for order management
//                    
 * ------------------------------------------------------------------------
 * Revision History:
 * Date          | Author      | Description
 * ------------------------------------------------------------------------
 * 20241006        |    Hansani|   Added API endpoint including creating,
//                                     retrieving, updating, and canceling orders
//                                   
 *
 **************************************************************************/
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.DataAccessLayer.Services;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize] // Ensures only authorized users can access this controller's actions.
    [ApiController] // Marks the class as an API controller, which provides routing and model validation.
    public class OrderController : ControllerBase
    {
        private readonly IOrderDL _orderDL; // Dependency injection for data access layer interface handling order operations.

        public OrderController(IOrderDL orderDL)
        {
            _orderDL = orderDL; // Assign the injected data access layer to a private field.
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            // Creates a new order by calling the CreateOrder method from the data access layer.
            var (created, message) = await _orderDL.CreateOrder(order);
            if (created)
            {
                // If creation is successful, return the order and a success message.
                return Ok(new { Message = message, Product = order });
            }
            else
            {
                // If creation fails, return a bad request with an error message.
                return BadRequest(new { Message = message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            // Retrieves a specific order by its ID from the data access layer.
            var order = await _orderDL.GetOrderById(orderId);
            if (order == null)
            {
                // If the order is not found, return a 404 Not Found response.
                return NotFound();
            }
            return Ok(order); // Return the found order with a 200 OK status.
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            // Retrieves all orders from the data access layer.
            var orders = await _orderDL.GetAllOrders();
            return Ok(orders); // Return the list of orders with a 200 OK status.
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            // Updates the specified order using the UpdateOrder method from the data access layer.
            var updated = await _orderDL.UpdateOrder(order);
            if (updated)
            {
                // Return a success message if the order was updated successfully.
                return Ok("Order updated successfully.");
            }
            return BadRequest("Failed to update order."); // Return an error message if the update failed.
        }

        [HttpPut]
        public async Task<IActionResult> CancelOrder(string orderId, [FromQuery] string reason)
        {
            // Cancels the specified order by calling the CancelOrder method from the data access layer.
            var canceled = await _orderDL.CancelOrder(orderId, reason);
            if (canceled)
            {
                // If the cancellation is successful, return a success message.
                return Ok("Order cancelled successfully.");
            }
            // Return an error message if the cancellation fails.
            return BadRequest("Failed to cancel order.");
        }
    }
}

