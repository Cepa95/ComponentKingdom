using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly ILogger<OrdersController> _logger;
        private readonly IUnitOfWork _unitOfWork;

        public OrdersController(IOrderService orderService,
                               IMapper mapper,
                               ILogger<OrdersController> logger,
                               IUnitOfWork unitOfWork)
        {
            _orderService = orderService;
            _mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            _logger.LogInformation("Creating order for basketId: {basketId}", orderDto.BasketId);

            var email = HttpContext.User.RetrieveEmailFromPrincipal();

            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);

            try
            {

                var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);

                if (order == null) return BadRequest(new ApiResponse(400, "Problem with creating order"));

                return Ok(order);
            }

            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, ex.Message));
            }

        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            _logger.LogInformation("Getting orders for user");

            var email = HttpContext.User.RetrieveEmailFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            _logger.LogInformation("Getting order for user with id: {id}", id);

            var email = HttpContext.User.RetrieveEmailFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404, "No order id found for your order"));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            _logger.LogInformation("Getting delivery methods");

            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            _logger.LogInformation($"Deleting order under id: {id}");

            var order = await _unitOfWork.Repository<Order>().GetByIdAsync(id);

            if (order == null) return NotFound(new ApiResponse(404, "Order not found"));


            _unitOfWork.Repository<Order>().Delete(order);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem deleting order"));

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<NewOrderDto>> UpdateOrderAsync(int id, NewOrderDto orderUpdateDto)
        {
            _logger.LogInformation($"Updating an order under id: {id}");

            var order = await _unitOfWork.Repository<Order>().GetByIdAsync(id);

            if (order == null) return NotFound(new ApiResponse(404, $"Order under id: {id} is not found"));

            _mapper.Map(orderUpdateDto, order);

            _unitOfWork.Repository<Order>().Update(order);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<Order, NewOrderDto>(order));
        }
    }
}