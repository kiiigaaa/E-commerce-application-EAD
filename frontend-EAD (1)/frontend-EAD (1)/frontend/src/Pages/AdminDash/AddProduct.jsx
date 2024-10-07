import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddProduct = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        productID: "",
        productName: "",
        description: "",
        category: "",
        price: 0,
        stockLevel: 0,
        status: "",
        vendorID: "",
    });

    const [errors, setErrors] = useState({});
    const info = JSON.parse(localStorage.getItem("productAdmin")) || {};

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
                    `${configs.apiUrl}/Product/CreateProduct`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/productDash');
                });
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    };

    const handleEdit = async () => {
        const newData = {
            productID: info.row.productID,
            productName: newObject.productName,
            description: newObject.description,
            category: newObject.category,
            price: newObject.price,
            stockLevel: info.row.stockLevel,
            status: newObject.status,
            vendorID: newObject.vendorID,
            createdDate: info.row.createdDate
        }
        if (validateForm()) {
            try {
                await axios.put(
                    `${configs.apiUrl}/Product/UpdateProduct`, newData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('productAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/productDash');
                }, 1000);
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to Update",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!newObject.productID.trim()) {
            errors.productID = 'Product ID is required';
            isValid = false;
        }
        if (!newObject.productName.trim()) {
            errors.productName = 'Product Name is required';
            isValid = false;
        }
        if (!newObject.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }
        if (!newObject.category.trim()) {
            errors.category = 'Category is required';
            isValid = false;
        }
        if (!newObject.price) {
            errors.price = 'Price is required';
            isValid = false;
        }
        if (!newObject.stockLevel) {
            errors.stockLevel = 'Stock Level is required';
            isValid = false;
        }
        if (!newObject.status.trim()) {
            errors.status = 'Status is required';
            isValid = false;
        }
        if (!newObject.vendorID.trim()) {
            errors.vendorID = 'Vendor ID is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('productAdmin', JSON.stringify({}));
        navigate('/productDash');
    };

    return (
        <div style={{ height: '140vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit Product
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add Product
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit Product
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add Product
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
                                Product Form
                            </Typography>
                            <hr />
                        </Grid>
                        {!info.editBtn && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Product ID"
                                        fullWidth
                                        value={newObject.productID}
                                        onChange={(e) => setNewObject({ ...newObject, productID: e.target.value })}
                                        error={!!errors.productID}
                                        helperText={errors.productID}
                                    />
                                </Grid>
                            </>
                        )}
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
                                label="Description"
                                fullWidth
                                value={newObject.description}
                                onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Category"
                                fullWidth
                                value={newObject.category}
                                onChange={(e) => setNewObject({ ...newObject, category: e.target.value })}
                                error={!!errors.category}
                                helperText={errors.category}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Price"
                                fullWidth
                                value={newObject.price}
                                onChange={(e) => setNewObject({ ...newObject, price: e.target.value })}
                                error={!!errors.price}
                                helperText={errors.price}
                                type='number'
                            />
                        </Grid>
                        {!info.editBtn && (
                            <>
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
                            </>
                        )}
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={newObject.status}
                                    onChange={(e) => setNewObject({ ...newObject, status: e.target.value })}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="InActive">Inactive</MenuItem>
                                </Select>
                                {errors.status && <Typography color="error">{errors.status}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Vendor ID"
                                fullWidth
                                value={newObject.vendorID}
                                onChange={(e) => setNewObject({ ...newObject, vendorID: e.target.value })}
                                error={!!errors.vendorID}
                                helperText={errors.vendorID}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddProduct;
