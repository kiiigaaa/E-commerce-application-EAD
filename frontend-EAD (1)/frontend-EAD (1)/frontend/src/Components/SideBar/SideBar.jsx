import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const SideBar = () => {
  const defaultTheme = createTheme();
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
    <ThemeProvider theme={defaultTheme}>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1c2331',
            color: '#ffffff',
          },
        }}
      >

        <>
          <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
            <Typography variant="h5" sx={{ color: '#ecf0f1' }}>
              Main Panel
            </Typography>
          </Toolbar>
          <List>
            {userRole === 'Admin' && (
              <>
                <ListItem
                  button
                  selected={selectedItem === 'userDash'}
                  onClick={() => handleItemClick('userDash')}
                  sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
                >
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#ecf0f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="User Panel" />
                </ListItem>
              </>
            )}
            <ListItem
              button
              selected={selectedItem === 'inventoryDash'}
              onClick={() => handleItemClick('inventoryDash')}
              sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
            >
              <ListItemIcon>
                <BadgeIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Inventory Panel" />
            </ListItem>
            <ListItem
              button
              selected={selectedItem === 'productDash'}
              onClick={() => handleItemClick('productDash')}
              sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
            >
              <ListItemIcon>
                <BadgeIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Product Panel" />
            </ListItem>
            <ListItem
              button
              selected={selectedItem === 'orderDash'}
              onClick={() => handleItemClick('orderDash')}
              sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
            >
              <ListItemIcon>
                <BadgeIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Order Panel" />
            </ListItem>
            <ListItem
              button
              selected={selectedItem === 'vendorDash'}
              onClick={() => handleItemClick('vendorDash')}
              sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}
            >
              <ListItemIcon>
                <BadgeIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Vendor Panel" />
            </ListItem>
          </List>
          <List sx={{ marginTop: 'auto' }}>
            <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#2c3e50' } }}>
              <LogoutIcon>
                <InventoryIcon sx={{ color: '#ecf0f1' }} />
              </LogoutIcon>
              <ListItemText primary="Logout" sx={{ paddingLeft: '50px' }} />
            </ListItem>
          </List>
        </>
      </Drawer>
    </ThemeProvider>
  );
};

export default SideBar;
