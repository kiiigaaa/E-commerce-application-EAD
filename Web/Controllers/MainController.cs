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
    [ApiController]
    public class MainController : ControllerBase
    {        
        private readonly IUserDL _userDL;
        private readonly IConfiguration _configuration;

        public MainController(IUserDL userDL, IConfiguration configuration)
        {            
            _userDL = userDL;
            _configuration = configuration;
        }
        private string GenerateToken(string username, string role, string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role),
            new Claim(ClaimTypes.NameIdentifier, userId) 
        }),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:DurationInMinutes"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        [HttpPost]
        public async Task<IActionResult> UserLogin([FromBody] LoginRequestMail request)
        {
            var user = await _userDL.GetUserByEmail(request.Email);            
            if (user == null || user.Status != "Active" || !user.VerifyPassword(request.Password))
            {
                return Unauthorized("Invalid credentials or user not active.");
            }

            var token = GenerateToken(user.Email, user.Role, user.UserId);
            return Ok(new { Token = token, User = user });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            try
            {
                var createdUser = await _userDL.CreateUser(user);
                return Ok(createdUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
