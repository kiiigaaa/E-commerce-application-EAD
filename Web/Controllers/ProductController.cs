/**************************************************************************
 * File:        ProductController.cs
 * Author:      Kishen
 * Date:        20241006
 * Description: This controller handles the product related API endpoints
//                    
 * ------------------------------------------------------------------------
 * Revision History:
 * Date          | Author      | Description
 * ------------------------------------------------------------------------
 * 20241006        |    Kishen|   This controller handles the product related API endpoints
//                                   
 *
 **************************************************************************/
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize] // Ensures only authorized users can access these actions.
    //[Authorize(Roles = "Admin")] // Optional: Restrict to users with the "Admin" role.
    [ApiController] // Marks the class as an API controller, providing routing and model validation functionality.
    public class ProductController : ControllerBase
    {
        private readonly IProductDL _productDL; // Dependency injection for the data access layer that handles product operations.

        public ProductController(IProductDL productDL)
        {
            _productDL = productDL; // Assigns the injected product data layer to a private field.
        }

        // Endpoint for creating a new product.
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            // Calls the CreateProduct method from the data layer to add a new product.
            var (created, message) = await _productDL.CreateProduct(product);
            if (created)
            {
                // Returns a success message and the product object if creation is successful.
                return Ok(new { Message = message, Product = product });
            }
            else
            {
                // Returns an error message if product creation fails.
                return BadRequest(new { Message = message });
            }
        }

        // Endpoint to retrieve all products.
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            // Calls the GetAllProducts method from the data layer to fetch all products.
            var products = await _productDL.GetAllProducts();
            return Ok(products); // Returns the list of products.
        }

        // Endpoint to retrieve a product by its ID.
        [HttpGet]
        public async Task<IActionResult> GetProductById(string productId)
        {
            // Calls the GetProductById method from the data layer to fetch a product by its ID.
            var product = await _productDL.GetProductById(productId);
            if (product == null)
            {
                // Returns a 404 Not Found response if the product does not exist.
                return NotFound();
            }
            return Ok(product); // Returns the product object if found.
        }

        // Endpoint to update an existing product.
        [HttpPut]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            // Calls the UpdateProduct method from the data layer to modify the product details.
            var updated = await _productDL.UpdateProduct(product);
            if (updated)
            {
                // Returns a success message if the product update was successful.
                return Ok("Product updated successfully.");
            }
            // Returns an error message if the update failed.
            return BadRequest("Failed to update product.");
        }

        // Endpoint to delete a product by its ID.
        [HttpDelete]
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            // Calls the DeleteProduct method from the data layer to remove a product by its ID.
            var deleted = await _productDL.DeleteProduct(productId);
            if (deleted)
            {
                // Returns a success message if the product was deleted successfully.
                return Ok("Product deleted successfully.");
            }
            // Returns an error message if the deletion failed.
            return BadRequest("Failed to delete product.");
        }
    }
}
