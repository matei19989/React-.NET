using Microsoft.AspNetCore.Mvc;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Services.Interfaces;
using AirbnbCloneBackend.DTOs;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using Microsoft.Extensions.Configuration;

namespace AirbnbCloneBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            var existingUser = await _userService.GetUserByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already in use" });
            }

            // Create user object
            var user = new User
            {
                Firstname = registerDto.Firstname,
                Lastname = registerDto.Lastname,
                Email = registerDto.Email,
                // Hash password in a real application
                Password = registerDto.Password,
                Phone = registerDto.Phone ?? string.Empty,
                DateRegistered = DateTime.UtcNow,
                IsHost = registerDto.IsHost,
                ProfilePicture = registerDto.ProfilePicture ?? "default-profile.jpg",
                Bio = registerDto.Bio ?? string.Empty
            };

            // Create user
            var createdUser = await _userService.CreateUserAsync(user);

            // Generate token
            var token = GenerateJwtToken(createdUser);

            // Return user data and token
            return Ok(new
            {
                user = new UserDTO
                {
                    UserId = createdUser.UserID,
                    Firstname = createdUser.Firstname,
                    Lastname = createdUser.Lastname,
                    Email = createdUser.Email,
                    IsHost = createdUser.IsHost,
                    ProfilePicture = createdUser.ProfilePicture
                },
                token
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by email
            var user = await _userService.GetUserByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password (in a real app, use hashing)
            if (user.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate token
            var token = GenerateJwtToken(user);

            // Return user data and token
            return Ok(new
            {
                user = new UserDTO
                {
                    UserId = user.UserID,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Email = user.Email,
                    IsHost = user.IsHost,
                    ProfilePicture = user.ProfilePicture
                },
                token
            });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("firstname", user.Firstname),
                new Claim("lastname", user.Lastname),
                new Claim("ishost", user.IsHost.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["JWT:ExpirationInDays"]));

            var token = new JwtSecurityToken(
                _configuration["JWT:ValidIssuer"],
                _configuration["JWT:ValidAudience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}