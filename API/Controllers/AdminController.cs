using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Entities.identity;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<AdminController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IOrderService _orderService;

        public AdminController(IUnitOfWork unitOfWork,
        IGenericRepository<Product> productsRepo,
        IMapper mapper,
        ILogger<AdminController> logger,
        UserManager<AppUser> userManager,
        IOrderService orderService
        )
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _userManager = userManager;
            _orderService = orderService;
        }

        [HttpGet("product/{id}")]
        public async Task<ActionResult<ProductCreateDto>> GetProductById(int id)
        {
            var product = await _productsRepo.GetByIdAsync(id);

            if (product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Product, ProductCreateDto>(product));
        }

        [HttpPut("products/{id}")]
        public async Task<ActionResult<ProductCreateDto>> UpdateProductAsync(int id, ProductCreateDto productUpdateDto)
        {
            _logger.LogInformation($"Updating a product under id: {id}");

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (product == null) return NotFound(new ApiResponse(404, $"Product under id: {id} is not found"));

            _mapper.Map(productUpdateDto, product);

            _unitOfWork.Repository<Product>().Update(product);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<Product, ProductCreateDto>(product));
        }

        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            _logger.LogInformation($"Deleting a product under id: {id}");

            var product = await _productsRepo.GetByIdAsync(id);

            if (product == null) return NotFound(new ApiResponse(404));

            _productsRepo.Delete(product);

            await _unitOfWork.Complete();

            return NoContent();
        }

        [HttpPost("products")]
        public async Task<ActionResult<ProductCreateDto>> CreateProductAsync(ProductCreateDto productCreateDto)
        {
            _logger.LogInformation("Creating a new product");

            var product = _mapper.Map<Product>(productCreateDto);

            _unitOfWork.Repository<Product>().Add(product);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductCreateDto>(product));
        }

        [HttpGet("customers")]
        public async Task<ActionResult<Pagination<CustomerDto>>> GetAllCustomers(int pageIndex = 1, int pageSize = 8, string search = null)
        {
            _logger.LogInformation("Getting all customers");

            var query = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.UserName.Contains(search.ToLower().Trim()));
            }

            var count = await query.CountAsync();

            var users = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = _mapper.Map<List<CustomerDto>>(users);

            var pagination = new Pagination<CustomerDto>(pageIndex, pageSize, count, userDtos);

            return Ok(pagination);
        }

        [HttpDelete("customers/{id}")]
        public async Task<ActionResult> DeleteCustomer(string id)
        {
            _logger.LogInformation($"Deleting a customer under id: {id}");

            var user = await _userManager.FindByIdAsync(id);

            if (user == null) return NotFound(new ApiResponse(404, "User not found"));

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400, "Problem deleting user"));

            return NoContent();
        }

        [HttpGet("address/{userId}")]
        public async Task<ActionResult<List<AddressDto>>> GetAddressByUserId(string userId)
        {
            _logger.LogInformation($"Getting addresses for user with ID: {userId}");

            userId = userId.Trim().ToLower();

            var address = await _userManager.Users
                .Where(u => u.Id.Trim().ToLower() == userId)
                .Select(u => u.Address)
                .SingleOrDefaultAsync();

            if (address == null) return NotFound(new ApiResponse(404, "address is not found"));

            var addressDto = _mapper.Map<AddressToReturnDto>(address);

            return Ok(addressDto);
        }

        [HttpGet("orders")]
        public async Task<ActionResult<Pagination<NewOrderDto>>> GetAllOrders(int pageIndex = 1, int pageSize = 2, string search = null)
        {
            _logger.LogInformation("Getting all orders");

            var spec = new OrdersWithItemsAndOrderingSpecification();

            if (!string.IsNullOrEmpty(search))
            {
                spec = new OrdersWithItemsAndOrderingSpecification(o => o.BuyerEmail.Contains(search.ToLower().Trim()));
            }

            var orders = await _orderService.GetAllOrdersAsync(spec, pageIndex, pageSize);

            var totalOrders = await _unitOfWork.Repository<Order>().CountAsync(spec);

            var orderDtos = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<NewOrderDto>>(orders);

            var pagination = new Pagination<NewOrderDto>(pageIndex, pageSize, totalOrders, orderDtos);

            return Ok(pagination);
        }

        [HttpGet("orderItems/{orderId}")]
        public async Task<ActionResult<List<OrderItemDto>>> GetOrderItemsByOrderId(int orderId)
        {
            _logger.LogInformation($"Getting order items for order with ID: {orderId}");

            var orderItems = await _unitOfWork.Repository<OrderItem>()
                .ListAsync(new OrderItemSpecification(orderId));

            if (orderItems == null || !orderItems.Any())
                return NotFound(new ApiResponse(404, "Order items not found"));

            var orderItemDtos = _mapper.Map<List<OrderItemDto>>(orderItems);

            return Ok(orderItemDtos);
        }

    }
}

