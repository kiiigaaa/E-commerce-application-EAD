using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Model;

namespace Web.DataAccessLayer.Services
{
    public class VendorDL : IVendorDL
    {
        private readonly IMongoCollection<Vendor> _vendors;

        public VendorDL(IConfiguration configuration)
        {
            var client = new MongoClient(configuration["Database:ConnectionString"]);
            var database = client.GetDatabase(configuration["Database:DatabaseName"]);
            _vendors = database.GetCollection<Vendor>("Vendors");
        }

        public async Task<Vendor> CreateVendor(Vendor vendor)
        {
            await _vendors.InsertOneAsync(vendor);
            return vendor;
        }

        public async Task<Vendor> GetVendorById(string vendorId)
        {
            return await _vendors.Find(v => v.VendorID == vendorId).FirstOrDefaultAsync();
        }

        public async Task<List<Vendor>> GetAllVendors()
        {
            return await _vendors.Find(_ => true).ToListAsync();
        }

        public async Task<bool> UpdateVendor(Vendor vendor)
        {
            var updateResult = await _vendors.ReplaceOneAsync(v => v.VendorID == vendor.VendorID, vendor);
            return updateResult.IsAcknowledged && updateResult.ModifiedCount == 1;
        }

        public async Task<bool> DeleteVendor(string vendorId)
        {
            var deleteResult = await _vendors.DeleteOneAsync(v => v.VendorID == vendorId);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1;
        }

        public async Task<bool> AddOrUpdateFeedback(string vendorId, CustomerFeedback feedback)
        {
            var vendor = await GetVendorById(vendorId);
            if (vendor != null)
            {
                var existingFeedback = vendor.CustomerComments.FirstOrDefault(f => f.CustomerID == feedback.CustomerID);
                if (existingFeedback != null)
                {
                    // Update existing feedback
                    existingFeedback.Rating = feedback.Rating;
                    existingFeedback.Comment = feedback.Comment;
                    existingFeedback.CommentDate = DateTime.UtcNow;
                }
                else
                {
                    // Add new feedback
                    feedback.CommentDate = DateTime.UtcNow;
                    vendor.CustomerComments.Add(feedback);
                }

                // Update the vendor in the database to reflect the changes
                var updateDefinition = Builders<Vendor>.Update
                    .Set(v => v.CustomerComments, vendor.CustomerComments); // This ensures all previous feedbacks remain and new one is added

                var updateResult = await _vendors.UpdateOneAsync(v => v.VendorID == vendorId, updateDefinition);
                return updateResult.IsAcknowledged && updateResult.ModifiedCount == 1;
            }
            return false;
        }

    }
}
