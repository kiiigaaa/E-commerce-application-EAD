using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer
{
    public interface IVendorDL
    {
        Task<Vendor> CreateVendor(Vendor vendor);
        Task<Vendor> GetVendorById(string vendorId);
        Task<List<Vendor>> GetAllVendors();
        Task<bool> UpdateVendor(Vendor vendor);
        Task<bool> DeleteVendor(string vendorId);
        Task<bool> AddOrUpdateFeedback(string vendorId, CustomerFeedback feedback);
    }
}
