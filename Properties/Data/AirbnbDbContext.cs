using Microsoft.EntityFrameworkCore;
using AirbnbCloneBackend.Models;

namespace AirbnbCloneBackend.Data
{
    public class AirbnbDbContext : DbContext
    {
        public AirbnbDbContext(DbContextOptions<AirbnbDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<Availability> Availabilities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicitly define the primary key for PropertyImage (from previous fix)
            modelBuilder.Entity<PropertyImage>()
                .HasKey(pi => pi.ImageID);

            // Define relationships and constraints
            modelBuilder.Entity<Property>()
                .HasOne(p => p.Host)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.HostID);

            modelBuilder.Entity<Property>()
                .HasOne(p => p.Location)
                .WithMany(l => l.Properties)
                .HasForeignKey(p => p.LocationID);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Property)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PropertyID);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Guest)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.GuestID)
                .OnDelete(DeleteBehavior.Restrict); // From previous fix

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Property)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PropertyID);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Restrict); // From previous fix

            // Disable cascading delete for BookingID to avoid multiple cascade paths
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Booking)
                .WithMany()
                .HasForeignKey(r => r.BookingID)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<PropertyImage>()
                .HasOne(pi => pi.Property)
                .WithMany(p => p.PropertyImages)
                .HasForeignKey(pi => pi.PropertyID);

            modelBuilder.Entity<Availability>()
                .HasOne(a => a.Property)
                .WithMany(p => p.Availabilities)
                .HasForeignKey(a => a.PropertyID);
        }
    }
}