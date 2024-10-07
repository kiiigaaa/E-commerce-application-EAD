using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Web.Model
{
    public class Vendor
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? VendorID { get; set; }
        public string VendorName { get; set; }
        public double AverageRating => CustomerComments.Select(x => x.Rating).DefaultIfEmpty(0).Average(); 
        public List<CustomerFeedback>? CustomerComments { get; set; } = new List<CustomerFeedback>();
    }

    public class CustomerFeedback
    {
        public string CustomerID { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CommentDate { get; set; }
    }
}
