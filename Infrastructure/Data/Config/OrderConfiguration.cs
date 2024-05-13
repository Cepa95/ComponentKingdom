using Core.Entities.OrderAggregate;
using Core.Entities.ProductAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.OwnsOne(o => o.ShipToAddress, a => { a.WithOwner(); });
            builder.Navigation(a => a.ShipToAddress).IsRequired();
            builder.Property(s => s.Status)
            .HasConversion(o => o.ToString(),
                           o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o));
            builder.Property(s => s.ProductStatus) 
            .HasConversion(o => o.ToString(),
                           o => (ProductStatus)Enum.Parse(typeof(ProductStatus), o));
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}