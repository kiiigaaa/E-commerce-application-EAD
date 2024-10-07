import { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const AddUser = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const [newObject, setNewObject] = useState({
        email: '',
        role: '',
        password: '',
        status: '',
    });

    const [errors, setErrors] = useState({});
    const info = JSON.parse(localStorage.getItem("userAdmin")) || {};

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
                    `${configs.apiUrl}/Main/CreateUser`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                Swal.fire({
                    title: "Success!",
                    text: "Added successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/userDash');
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
            "userId": info.row.userId,
            "email": newObject.email,
            "role": newObject.role,
            "password": newObject.password,
            "status": newObject.status,
            "createdDate": info.row.createdDate
        }
        if (validateForm()) {
            try {
                await axios.put(
                    `${configs.apiUrl}/User/UpdateUser`, newData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                Swal.fire({
                    title: "Success!",
                    text: "Updated successfully.",
                    icon: 'success',
                    confirmButtonText: "OK"
                });
                localStorage.setItem('userAdmin', JSON.stringify({}));
                setTimeout(() => {
                    navigate('/userDash');
                }, 1000);
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to Update.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!newObject.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(newObject.email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }
        if (!newObject.role.trim()) {
            errors.role = 'Role is required';
            isValid = false;
        }
        if (!newObject.password.trim()) {
            errors.password = 'Password is required';
            isValid = false;
        }
        if (!newObject.status.trim()) {
            errors.status = 'Status is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    const handleCancel = () => {
        localStorage.setItem('userAdmin', JSON.stringify({}));
        navigate('/userDash');
    };

    return (
        <div style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <AppBar position="fixed" style={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                <Toolbar>
                    {(info.editBtn) ? (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Edit User
                        </Typography>
                    ) : (
                        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Add User
                        </Typography>
                    )}

                    <div style={{ flexGrow: 1 }}></div>
                    {(info.editBtn) ? (
                        <Button variant="contained" color="primary" onClick={handleEdit}>
                            Edit User
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleAdd}>
                            Add User
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
                                User Form
                            </Typography>
                            <hr />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={newObject.email}
                                onChange={(e) => setNewObject({ ...newObject, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="role">Role</InputLabel>
                                <Select
                                    labelId="role"
                                    value={newObject.role}
                                    onChange={(e) => setNewObject({ ...newObject, role: e.target.value })}
                                    error={!!errors.role}
                                >
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="CSR">CSR</MenuItem>
                                    <MenuItem value="Vendor">Vendor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {(!info.editBtn) ? (
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={newObject.password}
                                    onChange={(e) => setNewObject({ ...newObject, password: e.target.value })}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>
                        ) : null}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    labelId="status"
                                    value={newObject.status}
                                    onChange={(e) => setNewObject({ ...newObject, status: e.target.value })}
                                    error={!!errors.status}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="InActive">InActive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};

export default AddUser;
