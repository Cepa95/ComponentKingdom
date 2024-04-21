
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {

        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<Order> _ordersRepo;
        private readonly IGenericRepository<OrderItem> _orderItemsRepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ProductsController> _logger;


        public ProductsController(IGenericRepository<Product> productsRepo,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IMapper mapper,
        IUnitOfWork unitOfWork,
        ILogger<ProductsController> logger,
        IGenericRepository<Order> ordersRepo,
        IGenericRepository<OrderItem> orderItemsRepo

        )
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _ordersRepo = ordersRepo;
            _orderItemsRepo = orderItemsRepo;

        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            //jer HttpGet status 415
            [FromQuery] ProductSpecParams productParams
        )
        {
            _logger.LogInformation("Getting all products");

            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            var countSpec = new ProductsWithFiltersForCountSpecification(productParams);
            var totalItems = await _productsRepo.CountAsync(countSpec);
            var products = await _productsRepo.ListAsync(spec);
            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
            productParams.PageSize, totalItems, data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            _logger.LogInformation($"Getting a product under id: {id}");

            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404, $"Product under id: {id} is not found"));

            return _mapper.Map<Product, ProductToReturnDto>(product);
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

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDto>>> GetProductTypes()
        {
            _logger.LogInformation("Getting all types");

            var spec = new TypesSpecification();

            var types = await _productTypeRepo.ListAsync(spec);

            var typesDto = _mapper.Map<IReadOnlyList<ProductType>, IReadOnlyList<ProductTypeDto>>(types);

            return Ok(typesDto);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            _logger.LogInformation($"Deleting a product under id: {id}");

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (product == null) return NotFound(new ApiResponse(404, $"Product under id: {id} is not found"));

            _unitOfWork.Repository<Product>().Delete(product);
            var result = await _unitOfWork.Complete();

            if (result >= 1) return Ok();

            return BadRequest(new ApiResponse(400, "Problem deleting product"));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("sales/{year}")]
        public async Task<ActionResult<IReadOnlyList<ProductSalesDto>>> GetProductSales(int year)
        {
            _logger.LogInformation($"Getting product sales for year {year}");

            var productSales = await _orderItemsRepo.Query()
                .Join(_ordersRepo.Query(),
                    oi => oi.OrderId,
                    o => o.Id,
                    (oi, o) => new { OrderItem = oi, Order = o })
                .Where(ooi => ooi.Order.OrderDate.Year == year)
                .GroupBy(ooi => ooi.OrderItem.ItemOrdered.ProductName)
                .Select(g => new ProductSalesDto
                {
                    ProductName = g.Key,
                    QuantitySold = g.Sum(ooi => ooi.OrderItem.Quantity)
                })
                .OrderByDescending(ps => ps.QuantitySold)
                .ToListAsync();

            return Ok(productSales);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("sales")]
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

    }
}