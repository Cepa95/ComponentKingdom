using API.Dtos;
using API.Dtos.API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
            .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
            .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name));

            CreateMap<Core.Entities.identity.Address, AddressDto>().ReverseMap();

            CreateMap<CustomerBasketDto, CustomerBasket>();

            CreateMap<BasketItemDto, BasketItem>();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();

            CreateMap<Order, OrderToReturnDto>()
            .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
            .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));

            CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
            .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
            .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));

            CreateMap<ProductCreateDto, Product>().ReverseMap();

            CreateMap<AppUser, CustomerDto>();

            CreateMap<Core.Entities.identity.Address, AddressToReturnDto>();

            CreateMap<ProductType, ProductTypeDto>();

            CreateMap<ProductBrand, BrandDto>();

            CreateMap<Order, OrderDto>();

            CreateMap<ProductBrand, BrandUpdateDto>().ReverseMap();

            CreateMap<ProductType, TypeCreateDto>().ReverseMap();

            CreateMap<Order, NewOrderDto>()
                .ForMember(dto => dto.ShipToAddress_FirstName, m => m.MapFrom(o => o.ShipToAddress.FirstName))
                .ForMember(dto => dto.ShipToAddress_LastName, m => m.MapFrom(o => o.ShipToAddress.LastName))
                .ForMember(dto => dto.ShipToAddress_Street, m => m.MapFrom(o => o.ShipToAddress.Street))
                .ForMember(dto => dto.ShipToAddress_City, m => m.MapFrom(o => o.ShipToAddress.City))
                .ForMember(dto => dto.ShipToAddress_State, m => m.MapFrom(o => o.ShipToAddress.State))
                .ForMember(dto => dto.ShipToAddress_ZipCode, m => m.MapFrom(o => o.ShipToAddress.ZipCode))
                .ForMember(dto => dto.DeliveryMethodPrice, m => m.MapFrom(o => o.DeliveryMethod.Price));



        }
    }
}