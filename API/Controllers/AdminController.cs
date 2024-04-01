using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        public AdminController(IUnitOfWork unitOfWork,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IGenericRepository<Product> productsRepo,
        IMapper mapper)
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _productTypeRepo = productTypeRepo;
            _productBrandRepo = productBrandRepo;
            _unitOfWork = unitOfWork;
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

        // [HttpPost("products")]
        // public async Task<ActionResult<ProductToReturnDto>> CreateProduct(ProductCreateDto productCreateDto)
        // {
        //     var product = _mapper.Map<ProductCreateDto, Product>(productCreateDto);
        //     _productsRepo.Add(product);

        //     await _unitOfWork.Complete();

        //     return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        // }

        // [HttpPut("products/{id}")]
        // public async Task<ActionResult<ProductToReturnDto>> UpdateProduct(int id, ProductCreateDto productCreateDto)
        // {
        //     var product = await _productsRepo.GetByIdAsync(id);

        //     if (product == null) return NotFound(new ApiResponse(404));

        //     _mapper.Map(productCreateDto, product);

        //     _productsRepo.Update(product);

        //     await _unitOfWork.Complete();

        //     return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        // }

        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _productsRepo.GetByIdAsync(id);

            if (product == null) return NotFound(new ApiResponse(404));

            _productsRepo.Delete(product);

            await _unitOfWork.Complete();

            return NoContent();
        }
    }
}