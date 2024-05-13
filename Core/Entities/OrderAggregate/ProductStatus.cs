using System.Runtime.Serialization;

namespace Core.Entities.ProductAggregate
{
    public enum ProductStatus
    {
        [EnumMember(Value ="Placed")]
        Placed,

        [EnumMember(Value ="In Progress")]
        InProgress,

        [EnumMember(Value ="In transit")]
        InTransit,

        [EnumMember(Value ="Completed")]
        Completed
    }
}
