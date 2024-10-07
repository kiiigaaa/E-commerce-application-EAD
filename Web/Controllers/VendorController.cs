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
    public class VendorController : ControllerBase
    {
        private readonly IVendorDL _vendorDL;

        public VendorController(IVendorDL vendorDL)
        {
            _vendorDL = vendorDL;
        }

        [HttpPost]        
        public async Task<IActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            var createdVendor = await _vendorDL.CreateVendor(vendor);

            return Ok(createdVendor);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVendors()
        {
            var vendors = await _vendorDL.GetAllVendors();
            return Ok(vendors);
        }

        [HttpPut]        
        public async Task<IActionResult> UpdateFeedback(string vendorId, [FromBody] CustomerFeedback feedback)
        {
            bool updated = await _vendorDL.AddOrUpdateFeedback(vendorId, feedback);
            if (updated)
            {
                return Ok("Feedback updated successfully.");
            }
            return BadRequest("Failed to update feedback.");
        }
    }
}
