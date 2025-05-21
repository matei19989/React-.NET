using AirbnbCloneBackend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Interfaces
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId);
        Task<IEnumerable<Booking>> GetBookingsByPropertyAsync(int propertyId);
        Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime checkIn, DateTime checkOut);
    }
}