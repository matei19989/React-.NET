using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.DTOs
{
    public class BecomeHostDTO
    {
        public string? Bio { get; set; }
    }

    public class UpdateUserDTO
    {
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Password { get; set; }
        public string? Phone { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePicture { get; set; }
    }
}