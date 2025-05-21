using AirbnbCloneBackend.Models;
using System;
using System.Linq;
namespace AirbnbCloneBackend.Data
{
    public static class SeedData
    {
        public static void Initialize(AirbnbDbContext context)
        {
            context.Database.EnsureCreated();
            if (!context.Users.Any())
            {
                var user = new User
                {
                    Firstname = "John",
                    Lastname = "Doe",
                    Email = "john.doe@example.com",
                    Password = "password123",
                    Phone = "1234567890",
                    DateRegistered = DateTime.Now,
                    IsHost = true,
                    ProfilePicture = "url",
                    Bio = "I am a host"
                };
                context.Users.Add(user);
                context.SaveChanges();

                var location = new Location
                {
                    Country = "USA",
                    City = "New York",
                    State = "NY",
                    ZipCode = "10001",
                    Address = "123 Main St",
                    Latitude = 40.7128m,
                    Longitude = -74.0060m
                };
                context.Locations.Add(location);
                context.SaveChanges();

                var property = new Property
                {
                    HostID = user.UserID,
                    LocationID = location.LocationID,
                    Title = "Cozy Apartment in NY",
                    Description = "Experience the charm of New York City in this beautiful, centrally located apartment. This cozy space offers modern amenities with classic New York style, perfect for couples or small families looking to explore the city. Just minutes from major attractions, restaurants, and public transportation.",
                    PricePerNight = 100.00m,
                    MaxGuests = 4,
                    Bedrooms = 2,
                    Bathrooms = 1,
                    PropertyType = "Apartment",
                    Amenities = "WiFi, TV, Air Conditioning, Kitchen, Washer, Dryer, Iron, Heating, Coffee Maker",
                    IsActive = true,
                    DateListed = DateTime.Now,
                    CleaningFee = 20.00m,
                    CancellationPolicy = "Flexible - Full refund if cancelled at least 48 hours before check-in",
                    HouseRules = "No smoking, No pets, No parties or events, Check-in after 3PM"
                };
                context.Properties.Add(property);
                context.SaveChanges();

                // Add property images
                var propertyImages = new PropertyImage[]
                {
                    new PropertyImage {
                        PropertyID = property.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Living room with city view"
                    },
                    new PropertyImage {
                        PropertyID = property.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Master bedroom"
                    },
                    new PropertyImage {
                        PropertyID = property.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Modern kitchen"
                    },
                    new PropertyImage {
                        PropertyID = property.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Bathroom"
                    }
                };

                context.PropertyImages.AddRange(propertyImages);
                context.SaveChanges();

                // Add a second property
                var location2 = new Location
                {
                    Country = "USA",
                    City = "San Francisco",
                    State = "CA",
                    ZipCode = "94103",
                    Address = "456 Market St",
                    Latitude = 37.7749m,
                    Longitude = -122.4194m
                };
                context.Locations.Add(location2);
                context.SaveChanges();

                var property2 = new Property
                {
                    HostID = user.UserID,
                    LocationID = location2.LocationID,
                    Title = "Luxury Downtown SF Loft",
                    Description = "Stay in the heart of San Francisco in this modern luxury loft. Featuring high ceilings, floor-to-ceiling windows, and designer furnishings. Perfect for business travelers or couples seeking an upscale city experience with stunning views of the city skyline.",
                    PricePerNight = 175.00m,
                    MaxGuests = 2,
                    Bedrooms = 1,
                    Bathrooms = 1,
                    PropertyType = "Loft",
                    Amenities = "WiFi, Smart TV, Gym Access, Rooftop Terrace, Fully Equipped Kitchen, Washer/Dryer, Dishwasher",
                    IsActive = true,
                    DateListed = DateTime.Now,
                    CleaningFee = 30.00m,
                    CancellationPolicy = "Moderate - Full refund if cancelled 5 days before check-in",
                    HouseRules = "No smoking, Quiet hours after 10PM, No pets"
                };
                context.Properties.Add(property2);
                context.SaveChanges();

                // Add images for the second property
                var property2Images = new PropertyImage[]
                {
                    new PropertyImage {
                        PropertyID = property2.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-[image-id]?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Modern loft living area"
                    },
                    new PropertyImage {
                        PropertyID = property2.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Bedroom with city view"
                    },
                    new PropertyImage {
                        PropertyID = property2.PropertyID,
                        ImageUrl = "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
                        Description = "Kitchen and dining area"
                    }
                };

                context.PropertyImages.AddRange(property2Images);
                context.SaveChanges();
            }
        }
    }
}