using MongoDB.Bson.Serialization.Attributes;
using BCrypt.Net;
using System;

namespace Web.Model
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? UserId { get; set; }

        [BsonElement("Email")]
        public string Email { get; set; }

        public string? Role { get; set; } = "Admin"; 
        public string Password { get; set; }
        public string? Status { get; set; } = "Active"; 
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public void SetPassword(string password)
        {
            Password = BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, Password);
        }
    }
}
