using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepo;

        private readonly ILogger<OrderService> _logger;

        public OrderService(IBasketRepository basketRepo,
                            IUnitOfWork unitOfWork,
                            ILogger<OrderService> logger)
        {
            _basketRepo = basketRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            var basket = await _basketRepo.GetBasketAsync(basketId);

            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                if (productItem.ProductAvailable < item.Quantity)
                {
                    _logger.LogInformation("Product is not available in required quantity");
                    throw new Exception("Product is not available in required quantity");
                }


                var itemOrdered = new ProductItemOrdered(productItem.Id,
                                                        productItem.Name,
                                                        productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            var subtotal = items.Sum(item => item.Price * item.Quantity);

            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);

            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order != null)
            {
                order.ShipToAddress = shippingAddress;
                order.DeliveryMethod = deliveryMethod;
                order.SubTotal = subtotal;
                _unitOfWork.Repository<Order>().Update(order);
            }
            else
            {
                order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
                _unitOfWork.Repository<Order>().Add(order);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            foreach (var item in items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.ItemOrdered.ProductItemId);
                product.ProductAvailable -= item.Quantity;
                _unitOfWork.Repository<Product>().Update(product);
            }

            result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            return order;
        }


        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }

        public async Task<IReadOnlyList<Order>> GetAllOrdersAsync(ISpecification<Order> spec, int pageIndex, int pageSize)
        {
            var orders = await _unitOfWork.Repository<Order>().ListPaginatedAsync(spec, pageIndex, pageSize);
            return orders;
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            var spec = new OrderWithItemsSpecification(id);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }
    }
}