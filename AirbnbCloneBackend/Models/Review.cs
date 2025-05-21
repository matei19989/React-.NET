using System;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; } // PK
        public int PropertyID { get; set; }
        public int UserID { get; set; }
        public int BookingID { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime ReviewDate { get; set; }

        public Property Property { get; set; }
        public User User { get; set; }
        public Booking Booking { get; set; }
    }
}