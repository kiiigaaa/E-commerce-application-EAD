import { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Person, BoxSeam, Cart4, Shop, People, Receipt, DoorOpen } from 'react-bootstrap-icons'; // Icons from react-bootstrap-icons

const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole");

  useEffect(() => {
    const storedSelectedItem = window.sessionStorage.getItem('selectedItem');
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    window.sessionStorage.setItem('selectedItem', item);
    navigate(`/${item}`);
  };

  const handleLogout = () => {
    sessionStorage.setItem("hradmin", false);
    window.location.href = `/`;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="flex-column" style={{ height: '100vh', width: '240px' }}>
      <Container className="d-flex flex-column">
        <Navbar.Brand className="text-center">Main Panel</Navbar.Brand>
        <Nav className="flex-column w-100">
          {userRole === 'Admin' && (
            <Nav.Link 
              active={selectedItem === 'userDash'} 
              onClick={() => handleItemClick('userDash')} 
              className="d-flex align-items-center text-light">
              <People className="me-2" /> User Panel
            </Nav.Link>
          )}
          <Nav.Link 
            active={selectedItem === 'inventoryDash'} 
            onClick={() => handleItemClick('inventoryDash')} 
            className="d-flex align-items-center text-light">
            <BoxSeam className="me-2" /> Inventory Panel
          </Nav.Link>
          <Nav.Link 
            active={selectedItem === 'productDash'} 
            onClick={() => handleItemClick('productDash')} 
            className="d-flex align-items-center text-light">
            <Cart4 className="me-2" /> Product Panel
          </Nav.Link>
          <Nav.Link 
            active={selectedItem === 'orderDash'} 
            onClick={() => handleItemClick('orderDash')} 
            className="d-flex align-items-center text-light">
            <Shop className="me-2" /> Order Panel
          </Nav.Link>
          <Nav.Link 
            active={selectedItem === 'vendorDash'} 
            onClick={() => handleItemClick('vendorDash')} 
            className="d-flex align-items-center text-light">
            <Person className="me-2" /> Vendor Panel
          </Nav.Link>
          {/* Add Invoice Panel */}
          <Nav.Link 
            active={selectedItem === 'invoiceDash'} 
            onClick={() => handleItemClick('invoiceDash')} 
            className="d-flex align-items-center text-light">
            <Receipt className="me-2" /> Invoice Panel
          </Nav.Link>
        </Nav>

        <div className="mt-auto">
          <Button variant="danger" onClick={handleLogout} className="d-flex align-items-center">
            <DoorOpen className="me-2" /> Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default SideBar;
