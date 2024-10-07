import { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddVendor = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [newObject, setNewObject] = useState({
        vendorName: '',
    });
    const [errors, setErrors] = useState({});

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/Vendor/CreateVendor`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/vendorDash');
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

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!newObject.vendorName) {
            errors.vendorName = 'Vendor Name is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        navigate('/vendorDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Add Vendor
                    </Typography>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Add Vendor
                    </Button>
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
                                User Vendor
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Vendor Name"
                                fullWidth
                                value={newObject.vendorName}
                                onChange={(e) => setNewObject({ ...newObject, vendorName: e.target.value })}
                                error={!!errors.vendorName}
                                helperText={errors.vendorName}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddVendor;
