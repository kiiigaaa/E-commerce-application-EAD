import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogReg/AdminLogin';
import AdminRegister from './Pages/AdminLogReg/AdminRegister';
import UserDash from './Pages/AdminDash/UserDash';
import AddUser from './Pages/AdminDash/AddUser';
import InventoryDash from './Pages/AdminDash/InventoryDash';
import AddInventory from './Pages/AdminDash/AddInventory';
import ProductDash from './Pages/AdminDash/ProductDash';
import AddProduct from './Pages/AdminDash/AddProduct';
import OrderDash from './Pages/AdminDash/OrderDash';
import VendorDash from './Pages/AdminDash/VendorDash';
import AddVendor from './Pages/AdminDash/AddVendor';
import InvoiceManager from './Pages/AdminDash/InvoicePage';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/userDash" element={<UserDash />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/inventoryDash" element={<InventoryDash />} />
        <Route path="/addInventory" element={<AddInventory />} />
        <Route path="/productDash" element={<ProductDash />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/orderDash" element={<OrderDash />} />
        <Route path="/vendorDash" element={<VendorDash />} />
        <Route path="/addVendor" element={<AddVendor />} />
        <Route path="/invoiceDash" element={<InvoiceManager />} />
      </Routes>
    </Router>
  );
}

export default App;
