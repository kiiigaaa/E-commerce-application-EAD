using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer
{
    public interface IUserDL
    {
        Task<User> CreateUser(User user);
        Task<List<User>> GetAllUsers();
        Task<User> GetUserById(string userId);
        Task<User> GetUserByEmail(string email);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(string userId);
    }
}
