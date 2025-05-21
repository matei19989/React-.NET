using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Repositories.Interfaces;
using AirbnbCloneBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId)
        {
            return await _bookingRepository.GetBookingsByUserAsync(userId);
        }

        public async Task<IEnumerable<Booking>> GetBookingsByPropertyAsync(int propertyId)
        {
            return await _bookingRepository.GetBookingsByPropertyAsync(propertyId);
        }

        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            // Check if property is available for the requested dates
            bool isAvailable = await _bookingRepository.IsPropertyAvailableAsync(
                booking.PropertyID,
                booking.CheckInDate,
                booking.CheckOutDate);

            if (!isAvailable)
            {
                throw new InvalidOperationException("Property is not available for the selected dates");
            }

            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveChangesAsync();

            return booking;
        }

        public async Task CancelBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking != null)
            {
                await _bookingRepository.DeleteAsync(booking);
                await _bookingRepository.SaveChangesAsync();
            }
        }

        public async Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime checkIn, DateTime checkOut)
        {
            return await _bookingRepository.IsPropertyAvailableAsync(propertyId, checkIn, checkOut);
        }
    }
}