using API.Dtos;
using API.Errors;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BrandsController : BaseApiController
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<BrandsController> _logger;


        public BrandsController(IUnitOfWork unitOfWork,
                IGenericRepository<ProductBrand> productBrandRepo,
                IMapper mapper,
                ILogger<BrandsController> logger
                )
        {
            _mapper = mapper;
            _productBrandRepo = productBrandRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;

        }


        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<BrandDto>>> GetProductBrands()
        {
            _logger.LogInformation("Getting all brands");

            var spec = new BrandsSpecification();

            var brands = await _productBrandRepo.ListAsync(spec);

            var brandsDto = _mapper.Map<IReadOnlyList<ProductBrand>, IReadOnlyList<BrandDto>>(brands);

            return Ok(brandsDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<IReadOnlyList<BrandDto>>> DeleteProductBrand(int id)
        {
            _logger.LogInformation($"Deleting a brand under id: {id}");

            var brand = await _productBrandRepo.GetByIdAsync(id);

            if (brand == null) return NotFound(new ApiResponse(404, $"Brand under id: {id} is not found"));

            _productBrandRepo.Delete(brand);

            await _unitOfWork.Complete();

            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BrandUpdateDto>> UpdateProductBrand(int id, BrandUpdateDto brandDto)
        {
            _logger.LogInformation($"Updating a brand under id: {id}");

            var brand = await _productBrandRepo.GetByIdAsync(id);

            if (brand == null) return NotFound(new ApiResponse(404, $"Brand under id: {id} is not found"));

            _mapper.Map(brandDto, brand);

            _productBrandRepo.Update(brand);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductBrand, BrandUpdateDto>(brand));
        }

        [HttpPost]
        public async Task<ActionResult<BrandUpdateDto>> CreateProductBrand(BrandUpdateDto brandDto)
        {
            _logger.LogInformation("Creating a new product brand");

            var brand = _mapper.Map<ProductBrand>(brandDto);

            _productBrandRepo.Add(brand);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductBrand, BrandUpdateDto>(brand));
        }

    }
}