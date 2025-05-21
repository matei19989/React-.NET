using AirbnbCloneBackend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId);
        Task<IEnumerable<Booking>> GetBookingsByPropertyAsync(int propertyId);
        Task<Booking> CreateBookingAsync(Booking booking);
        Task CancelBookingAsync(int bookingId);
        Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime checkIn, DateTime checkOut);
    }
}