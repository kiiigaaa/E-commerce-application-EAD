/**************************************************************************
 * File:        MainController.cs
 * Author:      common
 * Date:        20241006
 * Description: Main Controller for handling user login and user creation.
//                    Contains methods for generating JWT tokens and managing user accounts
 * ------------------------------------------------------------------------
 * Revision History:
 * Date          | Author      | Description
 * ------------------------------------------------------------------------
 * 20241006        |     common | Main Controller for handling user login and user creation.
//                                   Contains methods for generating JWT tokens and managing user accounts
 *
 **************************************************************************/
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Web.DataAccessLayer;
using Web.Model;

namespace Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController] // Marks the class as an API controller, providing built-in routing and model validation functionality.
    public class MainController : ControllerBase
    {        
        private readonly IUserDL _userDL; // Dependency injection for user-related data access layer.
        private readonly IConfiguration _configuration; // Configuration object for accessing application settings, such as JWT secret.

        public MainController(IUserDL userDL, IConfiguration configuration)
        {            
            _userDL = userDL; // Assigning injected user data layer to a private field.
            _configuration = configuration; // Assigning injected configuration to a private field.
        }

        // Private method for generating JWT tokens.
        private string GenerateToken(string username, string role, string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler(); // Handler for creating JWT tokens.
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]); // Get the secret key from the configuration file.
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    // Claims are added to the token for identification purposes.
                    new Claim(ClaimTypes.Name, username), // Username claim.
                    new Claim(ClaimTypes.Role, role), // Role claim.
                    new Claim(ClaimTypes.NameIdentifier, userId) // User ID claim.
                }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:DurationInMinutes"])), // Token expiration time.
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature), // Signing the token using HMAC-SHA256 and the secret key.
                Issuer = _configuration["Jwt:Issuer"], // Token issuer (from configuration).
                Audience = _configuration["Jwt:Audience"] // Token audience (from configuration).
            };
            var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token based on the descriptor.
            return tokenHandler.WriteToken(token); // Return the JWT as a string.
        }

        // Endpoint to handle user login.
        [HttpPost]
        public async Task<IActionResult> UserLogin([FromBody] LoginRequestMail request)
        {
            // Retrieve the user by email from the data layer.
            var user = await _userDL.GetUserByEmail(request.Email);            
            if (user == null || user.Status != "Active" || !user.VerifyPassword(request.Password))
            {
                // If the user is not found, inactive, or the password is incorrect, return an unauthorized response.
                return Unauthorized("Invalid credentials or user not active.");
            }

            // Generate JWT token for the authenticated user.
            var token = GenerateToken(user.Email, user.Role, user.UserId);
            return Ok(new { Token = token, User = user }); // Return the token and user details in the response.
        }

        // Endpoint to handle user creation.
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            try
            {
                // Attempt to create a new user by calling the data layer method.
                var createdUser = await _userDL.CreateUser(user);
                return Ok(createdUser); // Return the created user object with an HTTP 200 OK response.
            }
            catch (Exception ex)
            {
                // If any exception occurs, return a bad request with the error message.
                return BadRequest(ex.Message);
            }
        }
    }
}

