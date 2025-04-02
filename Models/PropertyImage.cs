using System.ComponentModel.DataAnnotations; // Add this for the [Key] attribute

namespace AirbnbCloneBackend.Models
{
    public class PropertyImage
    {
        [Key] // Explicitly mark ImageID as the primary key
        public int ImageID { get; set; } // PK
        public int PropertyID { get; set; } // FK to Property
        public string ImageUrl { get; set; }
        public string Description { get; set; }

        // Navigation property
        public Property Property { get; set; }
    }
}