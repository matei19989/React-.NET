using AirbnbCloneBackend.Data;
using AirbnbCloneBackend.Repositories.Implementations;
using AirbnbCloneBackend.Repositories.Interfaces;
using AirbnbCloneBackend.Services.Implementations;
using AirbnbCloneBackend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure JSON serialization to handle circular references
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", // Your local React app URL (Vite default)
                "http://localhost:5174", // Fallback port
                "http://localhost:3000"  // Alternative React port
             )
             .AllowAnyHeader()
             .AllowAnyMethod()
             .AllowCredentials();
    });
});

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});

// Add DbContext
builder.Services.AddDbContext<AirbnbDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

// Register services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

// Add DefaultFiles middleware BEFORE UseStaticFiles
app.UseDefaultFiles(); // This will look for index.html, default.html, etc.
app.UseStaticFiles();

app.UseRouting();

// Add CORS middleware - this must come before app.UseAuthorization()
app.UseCors("ReactAppPolicy");

// Add Authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Add a fallback route for client-side routing
app.MapFallbackToFile("index.html");

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AirbnbDbContext>();
    SeedData.Initialize(context);
}

app.Run();