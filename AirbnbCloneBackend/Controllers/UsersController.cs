using Microsoft.AspNetCore.Mvc;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Services.Interfaces;
using AirbnbCloneBackend.DTOs;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;

namespace AirbnbCloneBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users/profile
        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<UserDTO>> GetUserProfile()
        {
            // Get the current user's ID from the token claims
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserDTO
            {
                UserId = user.UserID,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Email = user.Email,
                IsHost = user.IsHost,
                ProfilePicture = user.ProfilePicture
            });
        }

        // PUT: api/Users/{id}/becomehost
        [Authorize]
        [HttpPut("{id}/becomehost")]
        public async Task<IActionResult> BecomeHost(int id, [FromBody] BecomeHostDTO dto)
        {
            // Get the current user's ID from the token claims
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            // Verify that the user is updating their own profile
            if (id != userId)
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update user to host status
            user.IsHost = true;
            
            // Update bio if provided
            if (!string.IsNullOrEmpty(dto.Bio))
            {
                user.Bio = dto.Bio;
            }

            await _userService.UpdateUserAsync(user);

            return NoContent();
        }

        // PUT: api/Users/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO dto)
        {
            // Get the current user's ID from the token claims
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            // Verify that the user is updating their own profile
            if (id != userId)
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update user properties
            user.Firstname = dto.Firstname ?? user.Firstname;
            user.Lastname = dto.Lastname ?? user.Lastname;
            user.Phone = dto.Phone ?? user.Phone;
            user.Bio = dto.Bio ?? user.Bio;
            
            // Only update password if provided
            if (!string.IsNullOrEmpty(dto.Password))
            {
                // In a real app, you'd hash the password
                user.Password = dto.Password;
            }
            
            // Only update profile picture if provided
            if (!string.IsNullOrEmpty(dto.ProfilePicture))
            {
                user.ProfilePicture = dto.ProfilePicture;
            }

            await _userService.UpdateUserAsync(user);

            return NoContent();
        }
    }
}