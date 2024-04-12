using API.Dtos;
using API.Dtos.API.Dtos;
using API.Errors;
using API.Extensions;
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
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<AdminController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IGenericRepository<Order> _ordersRepo;
        private readonly IOrderService _orderService;
        private readonly IGenericRepository<OrderItem> _orderItemsRepo;


        public AdminController(IUnitOfWork unitOfWork,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IGenericRepository<Product> productsRepo,
        IGenericRepository<Order> ordersRepo,
        IGenericRepository<OrderItem> orderItemsRepo,
        IMapper mapper,
        ILogger<AdminController> logger,
        UserManager<AppUser> userManager,
        IOrderService orderService)
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _productTypeRepo = productTypeRepo;
            _productBrandRepo = productBrandRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _userManager = userManager;
            _ordersRepo = ordersRepo;
            _orderService = orderService;
            _orderItemsRepo = orderItemsRepo;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<BrandDto>>> GetProductBrands()
        {
            _logger.LogInformation("Getting all brands");

            var spec = new BrandsSpecification();

            var brands = await _productBrandRepo.ListAsync(spec);

            var brandsDto = _mapper.Map<IReadOnlyList<ProductBrand>, IReadOnlyList<BrandDto>>(brands);

            return Ok(brandsDto);
        }

        [HttpDelete("brands/{id}")]
        public async Task<ActionResult<IReadOnlyList<BrandDto>>> DeleteProductBrand(int id)
        {
            _logger.LogInformation($"Deleting a brand under id: {id}");

            var brand = await _productBrandRepo.GetByIdAsync(id);

            if (brand == null) return NotFound(new ApiResponse(404));

            _productBrandRepo.Delete(brand);

            await _unitOfWork.Complete();

            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpPut("brands/{id}")]
        public async Task<ActionResult<BrandUpdateDto>> UpdateProductBrand(int id, BrandUpdateDto brandDto)
        {
            _logger.LogInformation($"Updating a brand under id: {id}");

            var brand = await _productBrandRepo.GetByIdAsync(id);

            if (brand == null) return NotFound(new ApiResponse(404));

            _mapper.Map(brandDto, brand);

            _productBrandRepo.Update(brand);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductBrand, BrandUpdateDto>(brand));
        }

        [HttpPost("brands")]
        public async Task<ActionResult<BrandUpdateDto>> CreateProductBrand(BrandUpdateDto brandDto)
        {
            _logger.LogInformation("Creating a new product brand");

            var brand = _mapper.Map<ProductBrand>(brandDto);

            _productBrandRepo.Add(brand);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductBrand, BrandUpdateDto>(brand));
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDto>>> GetProductTypes()
        {
            _logger.LogInformation("Getting all types");

            var spec = new TypesSpecification();

            var types = await _productTypeRepo.ListAsync(spec);

            var typesDto = _mapper.Map<IReadOnlyList<ProductType>, IReadOnlyList<ProductTypeDto>>(types);

            return Ok(typesDto);

        }

        [HttpDelete("types/{id}")]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDto>>> DeleteProductType(int id)
        {
            _logger.LogInformation($"Deleting a type under id: {id}");

            var type = await _productTypeRepo.GetByIdAsync(id);

            if (type == null) return NotFound(new ApiResponse(404));

            _productTypeRepo.Delete(type);

            await _unitOfWork.Complete();

            return Ok(await _productTypeRepo.ListAllAsync());
        }

        [HttpPut("types/{id}")]
        public async Task<ActionResult<TypeCreateDto>> UpdateProductType(int id, TypeCreateDto typeDto)
        {
            _logger.LogInformation($"Updating a type under id: {id}");

            var type = await _productTypeRepo.GetByIdAsync(id);

            if (type == null) return NotFound(new ApiResponse(404));

            _mapper.Map(typeDto, type);

            _productTypeRepo.Update(type);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductType, TypeCreateDto>(type));
        }

        [HttpPost("types")]
        public async Task<ActionResult<TypeCreateDto>> CreateProductType(TypeCreateDto typeDto)
        {
            _logger.LogInformation("Creating a new product type");

            var type = _mapper.Map<ProductType>(typeDto);

            _productTypeRepo.Add(type);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductType, TypeCreateDto>(type));
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


        [HttpPut("address/{userId}")]
        public async Task<ActionResult> UpdateAddressByUserId(string userId, AddressDto addressDto)
        {
            _logger.LogInformation($"Updating address for user with ID: {userId}");

            userId = userId.Trim().ToLower();

            var user = await _userManager.Users
                .Include(u => u.Address)
                .Where(u => u.Id.Trim().ToLower() == userId)
                .SingleOrDefaultAsync();

            if (user == null) return NotFound(new ApiResponse(404, "User not found"));

            if (user.Address == null) return NotFound(new ApiResponse(404, "Address not found"));

            _mapper.Map(addressDto, user.Address);

            try
            {
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded) return BadRequest(new ApiResponse(400, "Failed to update address"));

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "An error occurred while updating the address");
                return StatusCode(500, new ApiResponse(500, ex.InnerException?.Message));
            }
        }

        // [HttpGet("orders")]
        // public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetAllOrders()
        // {
        //     _logger.LogInformation("Getting all orders");

        //     var orders = await _orderService.GetAllOrdersAsync();

        //     return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        // }

        [HttpGet("products/sales")]
        public async Task<ActionResult<IReadOnlyList<ProductSalesDto>>> GetProductSales()
        {
            _logger.LogInformation("Getting product sales");

            var productSales = await _orderItemsRepo.GroupByAsync(
                oi => oi.ItemOrdered.ProductName,
                g => new ProductSalesDto
                {
                    ProductName = g.Key,
                    QuantitySold = g.Sum(oi => oi.Quantity)
                });

            return Ok(productSales.OrderByDescending(ps => ps.QuantitySold));
        }

        [HttpGet("orders")]
        public async Task<ActionResult<IReadOnlyList<NewOrderDto>>> GetAllOrders()
        {
            _logger.LogInformation("Getting all orders");

            var orders = await _orderService.GetAllOrdersAsync();

            var orderDtos = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<NewOrderDto>>(orders);

            return Ok(orderDtos);
        }

   











    }

}

