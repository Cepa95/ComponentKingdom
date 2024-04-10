using Core.Entities;

namespace Core.Specifications
{
    public class TypesSpecification : BaseSpecification<ProductType>
    {
        public TypesSpecification()
        {
            AddOrderBy(x => x.Name.ToLower());
        }
        
    }
}