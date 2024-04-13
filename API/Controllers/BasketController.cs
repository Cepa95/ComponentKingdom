using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;

        private readonly IMapper _mapper;

        private readonly ILogger<BasketController> _logger;

        public BasketController(IBasketRepository basketRepository, 
                                IMapper mapper,
                                ILogger<BasketController> logger)
        {
            _basketRepository = basketRepository;
            _mapper = mapper;
            _logger = logger;  
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            _logger.LogInformation("Getting basket for id: {id}", id);

            var basket = await _basketRepository.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
            _logger.LogInformation("Updating basket for customer: {customerId}", basket.Id);

            var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);
            
            var updateBasket = await _basketRepository.UpdateBasketAsync(customerBasket);

            return Ok(updateBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            _logger.LogInformation("Deleting basket for customer: {customerId}", id);
            
            await _basketRepository.DeleteBasketAsync(id);

        }
    }
}