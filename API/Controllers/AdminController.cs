using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[Authorize(Roles = "Admin")]
    public class AdminController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<AdminController> _logger;


        public AdminController(IUnitOfWork unitOfWork,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IGenericRepository<Product> productsRepo,
        IMapper mapper,
        ILogger<AdminController> logger)
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _productTypeRepo = productTypeRepo;
            _productBrandRepo = productBrandRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
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


    }
}