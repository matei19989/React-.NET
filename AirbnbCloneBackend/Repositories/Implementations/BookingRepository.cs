using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Repositories.Implementations
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(AirbnbDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId)
        {
            return await _context.Bookings
                .Include(b => b.Property)
                .ThenInclude(p => p.Location)
                .Include(b => b.Property)
                .ThenInclude(p => p.PropertyImages)
                .Where(b => b.GuestID == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByPropertyAsync(int propertyId)
        {
            return await _context.Bookings
                .Include(b => b.Guest)
                .Where(b => b.PropertyID == propertyId)
                .ToListAsync();
        }

        public async Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime checkIn, DateTime checkOut)
        {
            // Check if there are any overlapping bookings
            bool hasOverlappingBookings = await _context.Bookings
                .Where(b => b.PropertyID == propertyId)
                .AnyAsync(b =>
                    (checkIn >= b.CheckInDate && checkIn < b.CheckOutDate) ||  // Check-in date is during an existing booking
                    (checkOut > b.CheckInDate && checkOut <= b.CheckOutDate) || // Check-out date is during an existing booking
                    (checkIn <= b.CheckInDate && checkOut >= b.CheckOutDate));  // New booking completely overlaps an existing booking

            if (hasOverlappingBookings)
            {
                return false;
            }

            // Check property availability settings
            bool isAvailable = await _context.Availabilities
                .Where(a => a.PropertyID == propertyId)
                .AnyAsync(a =>
                    a.StartDate <= checkIn &&
                    a.EndDate >= checkOut &&
                    a.IsAvailable);

            return isAvailable;
        }
    }
}