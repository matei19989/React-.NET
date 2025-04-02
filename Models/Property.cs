using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AirbnbCloneBackend.Models
{
    public class Property
    {
        [Key]
        public int PropertyID { get; set; } // PK
        public int HostID { get; set; }
        public int LocationID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal PricePerNight { get; set; }
        public int MaxGuests { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public string PropertyType { get; set; }
        public string Amenities { get; set; }
        public bool IsActive { get; set; }
        public DateTime DateListed { get; set; }
        public decimal CleaningFee { get; set; }
        public string CancellationPolicy { get; set; }
        public string HouseRules { get; set; }

        public User Host { get; set; }
        public Location Location { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<PropertyImage> PropertyImages { get; set; }
        public ICollection<Availability> Availabilities { get; set; }
    }
}