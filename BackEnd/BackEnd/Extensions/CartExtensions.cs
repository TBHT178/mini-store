using BackEnd.DTOs;
using BackEnd.Entities;

namespace BackEnd.Extensions
{
    public static class CartExtensions
    {
        public static CartDto MapCartDto(this Cart cart)
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
