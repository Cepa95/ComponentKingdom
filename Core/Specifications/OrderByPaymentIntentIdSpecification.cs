using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentIdSpecification(string paymetIntentId) 
        : base(o => o.PaymentIntentId == paymetIntentId)
        {
        }

    }
}