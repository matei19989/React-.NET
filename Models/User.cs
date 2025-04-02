using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; } // PK
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateTime DateRegistered { get; set; }
        public bool IsHost { get; set; }
        public string ProfilePicture { get; set; }
        public string Bio { get; set; }

        public ICollection<Property> Properties { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}