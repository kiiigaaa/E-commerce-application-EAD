using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer.Services
{
    public class ProductDL : IProductDL
    {
        private readonly IMongoCollection<Product> _products;
        private readonly IInventoryDL _inventoryDL; 

        public ProductDL(IConfiguration configuration, IInventoryDL inventoryDL) 
        {
            var client = new MongoClient(configuration["Database:ConnectionString"]);
            var database = client.GetDatabase(configuration["Database:DatabaseName"]);
            _products = database.GetCollection<Product>("Products");
            _inventoryDL = inventoryDL; 
        }

        public async Task<(bool created, string message)> CreateProduct(Product product)
        {
            var inventory = await _inventoryDL.GetInventoryByProductId(product.ProductID);
            if (inventory != null && inventory.StockLevel < product.StockLevel)
            {
                return (false, "Stock level too high, product not created.");
            }

            product.CreatedDate = DateTime.UtcNow;
            product.ModifiedDate = DateTime.UtcNow;

            if (inventory != null)
            {
                inventory.StockLevel -= product.StockLevel;
                await _inventoryDL.UpdateInventory(inventory);
            }

            await _products.InsertOneAsync(product);

            if (inventory == null)
            {
                inventory = new Inventory { ProductID = product.ProductID, StockLevel = 0 };
                await _inventoryDL.CreateInventory(inventory);
            }

            return (true, "Product created successfully.");
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _products.Find(_ => true).ToListAsync();
        }

        public async Task<Product> GetProductById(string productId)
        {
            return await _products.Find(product => product.ProductID == productId).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateProduct(Product product)
        {
            product.ModifiedDate = DateTime.UtcNow;
            var result = await _products.ReplaceOneAsync(p => p.ProductID == product.ProductID, product);
            return result.IsAcknowledged && result.ModifiedCount == 1;
        }

        public async Task<bool> DeleteProduct(string productId)
        {
            var result = await _products.DeleteOneAsync(p => p.ProductID == productId);
            return result.IsAcknowledged && result.DeletedCount == 1;
        }

        public async Task<List<Product>> GetProductsByVendor(string vendorId)
        {
            return await _products.Find(product => product.VendorID == vendorId).ToListAsync();
        }
    }
}
