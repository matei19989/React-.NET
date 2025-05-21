using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.DTOs
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
    }

    public class RegisterDTO
    {
        [Required]
        public string? Firstname { get; set; }

        [Required]
        public string? Lastname { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(6)]
        public string? Password { get; set; }

        public string? Phone { get; set; }

        public bool IsHost { get; set; } = false;

        public string? ProfilePicture { get; set; }

        public string? Bio { get; set; }
    }

    public class UserDTO
    {
        public int UserId { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Email { get; set; }
        public bool IsHost { get; set; }
        public string? ProfilePicture { get; set; }
    }
}