using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer
{
    public interface IProductDL
    {
        Task<(bool created, string message)> CreateProduct(Product product);
        Task<List<Product>> GetAllProducts();
        Task<Product> GetProductById(string productId);
        Task<bool> UpdateProduct(Product product);
        Task<bool> DeleteProduct(string productId);
        Task<List<Product>> GetProductsByVendor(string vendorId);
    }
}
