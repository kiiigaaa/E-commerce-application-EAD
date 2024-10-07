using MongoDB.Bson.Serialization.Attributes;

namespace Web.Model
{
    public class Inventory
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? InventoryId { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? ProductID { get; set; } 
        public string ProductName { get; set; } 
        public int StockLevel { get; set; }

    



    }
}
