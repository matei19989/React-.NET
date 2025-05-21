using System;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class Availability
    {
        [Key]
        public int AvailabilityID { get; set; } // PK
        public int PropertyID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsAvailable { get; set; }

        public Property Property { get; set; }
    }
}