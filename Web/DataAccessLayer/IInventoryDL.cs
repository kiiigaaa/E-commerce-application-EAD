using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer
{
    public interface IInventoryDL
    {
        Task<Inventory> CreateInventory(Inventory inventory);
        Task<Inventory> GetInventoryByProductId(string productId);
        Task<List<Inventory>> GetAllInventories();
        Task<bool> UpdateInventory(Inventory inventory);
        Task<bool> DeleteInventory(string inventoryId);
    }
}
