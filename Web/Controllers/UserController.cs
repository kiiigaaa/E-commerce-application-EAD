using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize] // Restricts access to authenticated users.
    [ApiController] // Defines this class as an API controller, providing built-in features like model validation and routing.
    public class UserController : ControllerBase
    {
        private readonly IUserDL _userDL; // Dependency injection for the User Data Layer.

        public UserController(IUserDL userDL)
        {
            _userDL = userDL; // Assigns the injected user data layer to a private field.
        }

        // Endpoint to get a list of all users.
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Calls the data layer to retrieve all users.
            var users = await _userDL.GetAllUsers();
            return Ok(users); // Returns the list of users.
        }

        // Endpoint to get a specific user by their ID.
        [HttpGet]
        public async Task<IActionResult> GetUserById(string userId)
        {
            // Fetches the user details by userId from the data layer.
            var user = await _userDL.GetUserById(userId);
            if (user == null)
            {
                return NotFound(); // Returns 404 if the user is not found.
            }
            return Ok(user); // Returns the user details if found.
        }

        // Endpoint to update user information.
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            // Calls the data layer to update the user information.
            bool updated = await _userDL.UpdateUser(user);
            if (updated)
            {
                return Ok("Update successful."); // Success message if update succeeds.
            }
            else
            {
                return BadRequest("Update failed."); // Error message if update fails.
            }
        }

        // Endpoint to delete a user by their ID.
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            // Calls the data layer to delete the user.
            bool deleted = await _userDL.DeleteUser(userId);
            if (deleted)
            {
                return Ok("Delete successful."); // Success message if deletion is successful.
            }
            else
            {
                return BadRequest("Delete failed."); // Error message if deletion fails.
            }
        }

        // Endpoint to retrieve user details based on the token provided during authentication.
        [HttpGet]
        public async Task<IActionResult> GetUserByToken()
        {
            // Extracts the user ID from the token claims.
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                // Returns Unauthorized if the user ID is not found in the token.
                return Unauthorized("Invalid Token: User ID not found.");
            }

            // Fetches the user details from the data layer using the extracted user ID.
            var user = await _userDL.GetUserById(userId);
            if (user == null)
            {
                // Returns 404 if the user is not found in the database.
                return NotFound("User not found.");
            }

            return Ok(user); // Returns the user details if found.
        }

    }
}
