using Microsoft.AspNetCore.Mvc;
using AirbnbCloneBackend.Models;
using AirbnbCloneBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Threading.Tasks;

namespace AirbnbCloneBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IPropertyService _propertyService;

        public BookingsController(IBookingService bookingService, IPropertyService propertyService)
        {
            _bookingService = bookingService;
            _propertyService = propertyService;
        }

        // GET: api/Bookings/user (Get current user's bookings)
        [Authorize]
        [HttpGet("user")]
        public async Task<ActionResult> GetUserBookings()
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            var bookings = await _bookingService.GetBookingsByUserAsync(userId);
            return Ok(bookings);
        }

        // GET: api/Bookings/property/{propertyId} (Get bookings for a property - host only)
        [Authorize]
        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult> GetPropertyBookings(int propertyId)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            // Verify that the user owns this property
            var property = await _propertyService.GetPropertyByIdAsync(propertyId);
            if (property == null)
            {
                return NotFound();
            }

            if (property.HostID != userId)
            {
                return Forbid();
            }

            var bookings = await _bookingService.GetBookingsByPropertyAsync(propertyId);
            return Ok(bookings);
        }

        // POST: api/Bookings (Create new booking)
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] CreateBookingRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            // Validate dates
            if (request.CheckInDate >= request.CheckOutDate)
            {
                return BadRequest("Check-out date must be after check-in date");
            }

            if (request.CheckInDate <= DateTime.Now)
            {
                return BadRequest("Check-in date must be in the future");
            }

            // Get property details for pricing
            var property = await _propertyService.GetPropertyByIdAsync(request.PropertyID);
            if (property == null)
            {
                return NotFound("Property not found");
            }

            if (!property.IsActive)
            {
                return BadRequest("Property is not available for booking");
            }

            // Prevent users from booking their own properties
            if (property.HostID == userId)
            {
                return BadRequest("You cannot book your own property");
            }

            // Check availability
            var isAvailable = await _bookingService.IsPropertyAvailableAsync(request.PropertyID, request.CheckInDate, request.CheckOutDate);
            if (!isAvailable)
            {
                return BadRequest("Property is not available for the selected dates");
            }

            // Calculate total price
            var nights = (request.CheckOutDate - request.CheckInDate).Days;
            var totalPrice = (nights * property.PricePerNight) + property.CleaningFee;

            var booking = new Booking
            {
                PropertyID = request.PropertyID,
                GuestID = userId,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                NumGuests = request.NumGuests,
                TotalPrice = totalPrice
            };

            try
            {
                var createdBooking = await _bookingService.CreateBookingAsync(booking);
                return CreatedAtAction(nameof(GetUserBookings), new { id = createdBooking.BookingID }, createdBooking);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Bookings/{id} (Cancel booking)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized();
            }

            var bookings = await _bookingService.GetBookingsByUserAsync(userId);
            var booking = bookings.FirstOrDefault(b => b.BookingID == id);

            if (booking == null)
            {
                return NotFound();
            }

            // Check if booking can be cancelled (e.g., at least 24 hours before check-in)
            if (booking.CheckInDate <= DateTime.Now.AddHours(24))
            {
                return BadRequest("Cannot cancel booking less than 24 hours before check-in");
            }

            await _bookingService.CancelBookingAsync(id);
            return NoContent();
        }

        // GET: api/Bookings/availability/{propertyId} (Check availability for dates)
        [HttpGet("availability/{propertyId}")]
        public async Task<ActionResult<AvailabilityResponse>> CheckAvailability(
            int propertyId, 
            [FromQuery] DateTime checkIn, 
            [FromQuery] DateTime checkOut)
        {
            if (checkIn >= checkOut)
            {
                return BadRequest("Check-out date must be after check-in date");
            }

            var isAvailable = await _bookingService.IsPropertyAvailableAsync(propertyId, checkIn, checkOut);
            
            return Ok(new AvailabilityResponse
            {
                IsAvailable = isAvailable,
                PropertyID = propertyId,
                CheckInDate = checkIn,
                CheckOutDate = checkOut
            });
        }
    }

    // DTOs for the booking endpoints
    public class CreateBookingRequest
    {
        public int PropertyID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumGuests { get; set; }
    }

    public class AvailabilityResponse
    {
        public bool IsAvailable { get; set; }
        public int PropertyID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }
}