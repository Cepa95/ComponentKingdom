namespace API.Dtos
{
    public class NewOrderDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public string ShipToAddress_FirstName { get; set; }
        public string ShipToAddress_LastName { get; set; }
        public string ShipToAddress_Street { get; set; }
        public string ShipToAddress_City { get; set; }
        public string ShipToAddress_State { get; set; }
        public string ShipToAddress_ZipCode { get; set; }
        public decimal SubTotal { get; set; }
        public string Status { get; set; }
        public string ProductStatus { get; set; }
        public decimal DeliveryMethodPrice { get; set; }
    }

}