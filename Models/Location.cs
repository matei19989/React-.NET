using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class Location
    {
        [Key]
        public int LocationID { get; set; } // PK
        public string Country { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        public ICollection<Property> Properties { get; set; }
    }
}