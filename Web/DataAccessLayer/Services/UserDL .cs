using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer.Services
{
    public class UserDL : IUserDL
    {
        private readonly IMongoCollection<User> _users;

        public UserDL(IConfiguration configuration)
        {
            var client = new MongoClient(configuration["Database:ConnectionString"]);
            var database = client.GetDatabase(configuration["Database:DatabaseName"]);
            _users = database.GetCollection<User>("Users");
        }

        public async Task<User> CreateUser(User user)
        {
            var existingUser = await GetUserByEmail(user.Email);
            if (existingUser != null)
            {
                throw new Exception("User with the same email already exists.");
            }
            user.SetPassword(user.Password);
            user.CreatedDate = DateTime.UtcNow; 
            user.ModifiedDate = DateTime.UtcNow;
            await _users.InsertOneAsync(user);
            return user;
        }


        public async Task<List<User>> GetAllUsers()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetUserById(string userId)
        {
            return await _users.Find(user => user.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _users.Find(user => user.Email == email).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateUser(User user)
        {
            user.ModifiedDate = DateTime.UtcNow;
            var updateResult = await _users.ReplaceOneAsync(u => u.UserId == user.UserId, user, new ReplaceOptions { IsUpsert = false });
            return updateResult.IsAcknowledged && updateResult.ModifiedCount == 1;
        }


        public async Task<bool> DeleteUser(string userId)
        {
            var deleteResult = await _users.DeleteOneAsync(u => u.UserId == userId);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1;
        }
    }
}
