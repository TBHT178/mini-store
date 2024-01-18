using Azure;
using BackEnd.Data;
using BackEnd.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<StoreContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

// Ignore loop
//builder.Services.AddControllers().AddJsonOptions(options =>
//{
//    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCors",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                .AllowAnyMethod() // Allow any HTTP method
                .AllowAnyHeader()
                .AllowCredentials();
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Handle CORS preflight requests

app.UseCors("MyCors");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetService<ILogger<Program>>();
try
{
    //It applies any pending migrations for the context to the database, and it will create the database if it does not already exist
    //And if our database does already exist, then simply nothing happens if there's no migrations to apply.
    //And we already have our database, then this code doesn't do anything.
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch (Exception ex)
{

    logger.LogError(ex, "A problem occured during migration");
}



app.Run();
