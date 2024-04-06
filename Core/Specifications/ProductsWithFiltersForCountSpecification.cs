using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductsWithFiltersForCountSpecification(ProductSpecParams productParams)
        : base(x =>
            (string.IsNullOrEmpty(productParams.Search) ||
             productParams.Search.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                          .Select(word => word.Trim().ToLower())
                          .Where(word => !string.IsNullOrEmpty(word))
                          .All(word => x.Name.ToLower().Contains(word))) &&
            (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
            (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId))
        {
        }
    }
}