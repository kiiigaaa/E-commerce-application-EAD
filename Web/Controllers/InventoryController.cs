﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize] // Ensures that only authorized users can access the endpoints in this controller.
    [ApiController] // Marks the class as an API controller which automatically applies features like model validation and routing.
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryDL _inventoryDL; // Dependency injection for data access layer interface to handle inventory operations.

        public InventoryController(IInventoryDL inventoryDL)
        {
            _inventoryDL = inventoryDL; // Assign the injected data access layer to a private field.
        }

        [HttpPost]
        public async Task<IActionResult> CreateInventory([FromBody] Inventory inventory)
        {
            // Creates a new inventory record by calling the CreateInventory method in the data access layer.
            var createdInventory = await _inventoryDL.CreateInventory(inventory);
            return Ok(createdInventory); // Returns the created inventory in the response with an HTTP 200 OK status.
        }

        [HttpGet]
        public async Task<IActionResult> GetInventoryByProductId(string productId)
        {
            // Retrieves a single inventory record by its associated product ID.
            var inventory = await _inventoryDL.GetInventoryByProductId(productId);
            if (inventory == null)
            {
                // Returns an HTTP 404 Not Found if the inventory is not found for the given product ID.
                return NotFound();
            }
            return Ok(inventory); // Returns the found inventory with an HTTP 200 OK status.
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInventories()
        {
            // Retrieves all inventory records by calling the GetAllInventories method in the data access layer.
            var inventories = await _inventoryDL.GetAllInventories();
            return Ok(inventories); // Returns the list of all inventories with an HTTP 200 OK status.
        }

        [HttpPut]
        public async Task<IActionResult> UpdateInventory([FromBody] Inventory inventory)
        {
            // Retrieves the current inventory by product ID to check if it exists before updating.
            var currentInventory = await _inventoryDL.GetInventoryByProductId(inventory.ProductID);
            if (currentInventory == null)
            {
                // Returns an HTTP 404 Not Found if the inventory does not exist.
                return NotFound("Inventory not found.");
            }

            // Updates the inventory in the database using the UpdateInventory method from the data access layer.
            bool updated = await _inventoryDL.UpdateInventory(inventory);
            if (updated)
            {
                // Returns an HTTP 200 OK status if the update is successful.
                return Ok("Inventory updated successfully.");
            }
            // Returns an HTTP 400 Bad Request if the update fails.
            return BadRequest("Failed to update inventory.");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteInventory(string inventoryId)
        {
            // Deletes an inventory record by its ID by calling the DeleteInventory method in the data access layer.
            var deleted = await _inventoryDL.DeleteInventory(inventoryId);
            if (deleted)
            {
                // Returns an HTTP 200 OK status if the deletion is successful.
                return Ok("Inventory deleted successfully.");
            }
            // Returns an HTTP 400 Bad Request if the deletion fails.
            return BadRequest("Failed to delete inventory.");
        }
    }
}

