using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserDL _userDL;

        public UserController(IUserDL userDL)
        {
            _userDL = userDL;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userDL.GetAllUsers();
            return Ok(users);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await _userDL.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            bool updated = await _userDL.UpdateUser(user);
            if (updated)
            {
                return Ok("Update successful.");
            }
            else
            {
                return BadRequest("Update failed.");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            bool deleted = await _userDL.DeleteUser(userId);
            if (deleted)
            {
                return Ok("Delete successful.");
            }
            else
            {
                return BadRequest("Delete failed.");
            }
        }

        [HttpGet]        
        public async Task<IActionResult> GetUserByToken()
        {
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid Token: User ID not found.");
            }
            
            var user = await _userDL.GetUserById(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

    }
}
