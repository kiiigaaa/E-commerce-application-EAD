using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Web.Model
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? OrderID { get; set; }

        public string CustomerID { get; set; }
        public string ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string OrderStatus { get; set; } = "Processing"; 
        public string VendorID { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string CancellationReason { get; set; }
    }
}
