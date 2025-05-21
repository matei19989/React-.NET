using System;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class Booking
    {
        [Key]
        public int BookingID { get; set; } // PK
        public int PropertyID { get; set; }
        public int GuestID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumGuests { get; set; }
        public decimal TotalPrice { get; set; }

        public Property Property { get; set; }
        public User Guest { get; set; }
    }
}