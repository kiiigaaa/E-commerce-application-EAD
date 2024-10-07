using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize]
    //[Authorize(Roles = "Admin")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductDL _productDL;

        public ProductController(IProductDL productDL)
        {
            _productDL = productDL;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            var (created, message) = await _productDL.CreateProduct(product);
            if (created)
            {
                return Ok(new { Message = message, Product = product });
            }
            else
            {
                return BadRequest(new { Message = message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productDL.GetAllProducts();
            return Ok(products);
        }

        [HttpGet]
        public async Task<IActionResult> GetProductById(string productId)
        {
            var product = await _productDL.GetProductById(productId);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            var updated = await _productDL.UpdateProduct(product);
            if (updated)
            {
                return Ok("Product updated successfully.");
            }
            return BadRequest("Failed to update product.");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            var deleted = await _productDL.DeleteProduct(productId);
            if (deleted)
            {
                return Ok("Product deleted successfully.");
            }
            return BadRequest("Failed to delete product.");
        }
    }
}
