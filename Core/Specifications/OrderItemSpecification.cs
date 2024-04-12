using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderItemSpecification : BaseSpecification<OrderItem>
    {
        public OrderItemSpecification(int orderId)
            : base(oi => oi.OrderId == orderId)
        {
        }
    }
}