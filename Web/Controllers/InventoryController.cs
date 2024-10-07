using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryDL _inventoryDL;

        public InventoryController(IInventoryDL inventoryDL)
        {
            _inventoryDL = inventoryDL;
        }

        [HttpPost]
        public async Task<IActionResult> CreateInventory([FromBody] Inventory inventory)
        {
            var createdInventory = await _inventoryDL.CreateInventory(inventory);
            return Ok(createdInventory);
        }

        [HttpGet]
        public async Task<IActionResult> GetInventoryByProductId(string productId)
        {
            var inventory = await _inventoryDL.GetInventoryByProductId(productId);
            if (inventory == null)
            {
                return NotFound();
            }
            return Ok(inventory);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInventories()
        {
            var inventories = await _inventoryDL.GetAllInventories();
            return Ok(inventories);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateInventory([FromBody] Inventory inventory)
        {
            var currentInventory = await _inventoryDL.GetInventoryByProductId(inventory.ProductID);
            if (currentInventory == null)
            {
                return NotFound("Inventory not found.");
            }

       

            bool updated = await _inventoryDL.UpdateInventory(inventory);
            if (updated)
            {
                return Ok("Inventory updated successfully.");
            }
            return BadRequest("Failed to update inventory.");
        }

        


        [HttpDelete]
        public async Task<IActionResult> DeleteInventory(string inventoryId)
        {
            var deleted = await _inventoryDL.DeleteInventory(inventoryId);
            if (deleted)
            {
                return Ok("Inventory deleted successfully.");
            }
            return BadRequest("Failed to delete inventory.");
        }
    }
}
