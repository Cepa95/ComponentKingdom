using Core.Entities.ProductAggregate;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {

        }
        public Order(IReadOnlyList<OrderItem> orderItems,
                    string buyerEmail,
                    Address shipToAddress,
                    DeliveryMethod deliveryMethod,
                    decimal subTotal,
                    string paymetIntentId)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            SubTotal = subTotal;
            PaymentIntentId = paymetIntentId;
        }
        public string BuyerEmail { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public Address ShipToAddress { get; set; }

        public DeliveryMethod DeliveryMethod { get; set; }

        public IReadOnlyList<OrderItem> OrderItems { get; set; }

        public decimal SubTotal { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public ProductStatus ProductStatus { get; set; } = ProductStatus.Placed;

        public string PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return SubTotal + (DeliveryMethod?.Price ?? 0);
        }
    }
}