/**************************************************************************
 * File:        VendorController.cs
 * Author:      Sapna
 * Date:        20241006
 * Description: This controller handles the vendor related API endpoints
//                    
 * ------------------------------------------------------------------------
 * Revision History:
 * Date          | Author      | Description
 * ------------------------------------------------------------------------
 * 20241006        |    Sapna|   This controller handles the vendor related API endpoints
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
    [Authorize] // Requires user authentication for all actions.
    [ApiController] // Marks this as an API controller, providing routing and other API-specific features.
    public class VendorController : ControllerBase
    {
        private readonly IVendorDL _vendorDL; // Injects the Vendor Data Layer.

        // Constructor to initialize Vendor Data Layer.
        public VendorController(IVendorDL vendorDL)
        {
            _vendorDL = vendorDL;
        }

        // Endpoint to create a new vendor.
        [HttpPost]        
        public async Task<IActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            // Calls the data layer to create a new vendor.
            var createdVendor = await _vendorDL.CreateVendor(vendor);
            
            // Returns the created vendor.
            return Ok(createdVendor);
        }

        // Endpoint to retrieve all vendors.
        [HttpGet]
        public async Task<IActionResult> GetAllVendors()
        {
            // Calls the data layer to get all vendors.
            var vendors = await _vendorDL.GetAllVendors();
            
            // Returns the list of vendors.
            return Ok(vendors);
        }

        // Endpoint to add or update customer feedback for a vendor.
        [HttpPut]        
        public async Task<IActionResult> UpdateFeedback(string vendorId, [FromBody] CustomerFeedback feedback)
        {
            // Calls the data layer to add or update feedback for a specific vendor.
            bool updated = await _vendorDL.AddOrUpdateFeedback(vendorId, feedback);
            if (updated)
            {
                return Ok("Feedback updated successfully."); // Success message if feedback is updated.
            }
            return BadRequest("Failed to update feedback."); // Error message if update fails.
        }
    }
}
