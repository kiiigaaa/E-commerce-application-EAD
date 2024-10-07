import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddInventory = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        productName: "",
        stockLevel: 0,
        lowStockThreshold: 0,
        stockAlert: null
    });

    const [errors, setErrors] = useState({});
    const info = JSON.parse(localStorage.getItem("inventoryAdmin")) || {};

    useEffect(() => {
        if (info.editBtn) {
            setNewObject(info.row);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/Inventory/CreateInventory`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/inventoryDash');
                });
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to add.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    };

    const handleEdit = async () => {
        const newData = {
            inventoryId: info.row.inventoryId,
            productID: info.row.productID,
            productName: newObject.productName,
            stockLevel: newObject.stockLevel,
            lowStockThreshold: newObject.lowStockThreshold,
            stockAlert: newObject.stockAlert,
        }
        if (validateForm()) {
            try {
                await axios.put(
                    `${configs.apiUrl}/Inventory/UpdateInventory`, newData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('inventoryAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/inventoryDash');
                }, 1000);
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to Update or Stock is Exceeded.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!newObject.productName.trim()) {
            errors.productName = 'Status is required';
            isValid = false;
        }
        if (!newObject.stockLevel) {
            errors.stockLevel = 'Stock Level is required';
            isValid = false;
        }
        if (!newObject.lowStockThreshold) {
            errors.lowStockThreshold = 'Low Stock Threshold is required';
            isValid = false;
        }
       
        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('inventoryAdmin', JSON.stringify({}));
        navigate('/inventoryDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Inventory
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Inventory
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Inventory
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Inventory
                        </Button>
                    )}
                    <Button variant="contained" color="error" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                        Cancel
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" style={{ marginTop: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginBottom: '10px', color: 'black' }}>
                                Inventory Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Product Name"
                                fullWidth
                                value={newObject.productName}
                                onChange={(e) => setNewObject({ ...newObject, productName: e.target.value })}
                                error={!!errors.productName}
                                helperText={errors.productName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Stock Level"
                                fullWidth
                                value={newObject.stockLevel}
                                onChange={(e) => setNewObject({ ...newObject, stockLevel: e.target.value })}
                                error={!!errors.stockLevel}
                                helperText={errors.stockLevel}
                                type='number'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Low Stock Threshold"
                                fullWidth
                                value={newObject.lowStockThreshold}
                                onChange={(e) => setNewObject({ ...newObject, lowStockThreshold: e.target.value })}
                                error={!!errors.lowStockThreshold}
                                helperText={errors.lowStockThreshold}
                                type='number'
                            />
                        </Grid>
                       
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddInventory;
