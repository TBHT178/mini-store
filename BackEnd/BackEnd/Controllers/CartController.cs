using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await RetrieveCart();

            if (cart == null)
            {
                return NotFound();
            }
            return MapCartToDto(cart);
        }


        [HttpPost]      
        public async Task<ActionResult<CartDto>> AddIemToCart(int productId, int quantity)
        {
            // Get Cart || Create Cart
            var cart = await RetrieveCart();
            if(cart == null)
            {
                cart = CreateCart();
            }

            // Get Product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found"});
            
            // Add Item
            cart.AddItem(product, quantity);    //method of class Cart

            // Save changes
            var result = await _context.SaveChangesAsync();
            if(result > 0) return CreatedAtRoute("GetCart", MapCartToDto(cart));

            //if fail
            return BadRequest(new ProblemDetails { Title = "Prolem saving item to cart" });

        }
   

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            // Get Cart
            var cart = await RetrieveCart();
            if(cart == null) { return NotFound(); }
            
            // Remove item or reduce quantity
            cart.RemoveItem(productId, quantity);

            // Save changes
            var result = await _context.SaveChangesAsync();
            if (result > 0) return StatusCode(201);

            //if fail
            return BadRequest(new ProblemDetails { Title = "Prolem removing item from cart" });
        }

        private async Task<Cart?> RetrieveCart()
        {
            var cart = await _context.Carts
                                .Include(ci => ci.Items)
                                .ThenInclude(p => p.Product)
                                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["BuyerId"]);

            // Ensure that cart.Items is initialized as an empty array if it's null
            if (cart != null && cart.Items == null)
            {
                cart.Items = new List<CartItem>();
            }

            return cart;
        }

        private Cart? CreateCart()
        {
            // Generate globally unique identifier
            var buyerId = Guid.NewGuid().ToString();

            // Set cookieoption
            var cookieOptions = new CookieOptions { IsEssential= true, Expires = DateTime.Now.AddDays(30), SameSite=SameSiteMode.None, Secure=true };

            // Add cookie to response
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            // create new cart
            var cart = new Cart { BuyerId = buyerId };

            // Start tracking entity that added
            _context.Carts.Add(cart);
            return cart;
        }

        private CartDto MapCartToDto(Cart? cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                BuyerId = cart.BuyerId,
                Items = cart.Items.Select(item => new CartItemDto
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Name = item.Product.Name,
                    Brand = item.Product.Brand,
                    Type = item.Product.Type,
                    PictureUrl = item.Product.PictureUrl,
                    Price = item.Product.Price
                }).ToList(),
            };
        }
    }
}
