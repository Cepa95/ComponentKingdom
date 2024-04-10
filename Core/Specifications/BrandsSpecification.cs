using Core.Entities;

namespace Core.Specifications
{
    public class BrandsSpecification : BaseSpecification<ProductBrand>
    {
        public BrandsSpecification()
        {
            AddOrderBy(x => x.Name.ToLower());
        }
        
    }
}