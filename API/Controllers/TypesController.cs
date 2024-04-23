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
    public class TypesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<TypesController> _logger;


        public TypesController(IUnitOfWork unitOfWork,
        IGenericRepository<ProductBrand> productBrandRepo,
        IGenericRepository<ProductType> productTypeRepo,
        IGenericRepository<Product> productsRepo,
        IMapper mapper,
        ILogger<TypesController> logger
        )
        {
            _mapper = mapper;
            _productTypeRepo = productTypeRepo;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDto>>> GetProductTypes()
        {
            _logger.LogInformation("Getting all types");

            var spec = new TypesSpecification();

            var types = await _productTypeRepo.ListAsync(spec);

            var typesDto = _mapper.Map<IReadOnlyList<ProductType>, IReadOnlyList<ProductTypeDto>>(types);

            return Ok(typesDto);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<IReadOnlyList<ProductTypeDto>>> DeleteProductType(int id)
        {
            _logger.LogInformation($"Deleting a type under id: {id}");

            var type = await _productTypeRepo.GetByIdAsync(id);

            if (type == null) return NotFound(new ApiResponse(404, $"Type under id: {id} is not found"));

            _productTypeRepo.Delete(type);

            await _unitOfWork.Complete();

            return Ok(await _productTypeRepo.ListAllAsync());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TypeCreateDto>> UpdateProductType(int id, TypeCreateDto typeDto)
        {
            _logger.LogInformation($"Updating a type under id: {id}");

            var type = await _productTypeRepo.GetByIdAsync(id);

            if (type == null) return NotFound(new ApiResponse(404, $"Brand under id: {id} is not found"));

            _mapper.Map(typeDto, type);

            _productTypeRepo.Update(type);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductType, TypeCreateDto>(type));
        }

        [HttpPost]
        public async Task<ActionResult<TypeCreateDto>> CreateProductType(TypeCreateDto typeDto)
        {
            _logger.LogInformation("Creating a new product type");

            var type = _mapper.Map<ProductType>(typeDto);

            _productTypeRepo.Add(type);
            await _unitOfWork.Complete();

            return Ok(_mapper.Map<ProductType, TypeCreateDto>(type));
        }

    }
}