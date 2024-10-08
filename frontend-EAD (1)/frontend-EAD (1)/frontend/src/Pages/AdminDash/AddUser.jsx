import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        if (!newObject.password.trim() && !info.editBtn) {
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
        <div className="container" style={{ height: '100vh', paddingTop: '64px', backgroundColor: '#f4f4f4' }}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <span className="navbar-brand">{info.editBtn ? 'Edit User' : 'Add User'}</span>
                    <div className="ml-auto">
                        <button className="btn btn-primary mx-2" onClick={info.editBtn ? handleEdit : handleAdd}>
                            {info.editBtn ? 'Edit User' : 'Add User'}
                        </button>
                        <button className="btn btn-danger" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-5 pt-5">
                <div className="card p-4">
                    <h5 className="card-title">User Form</h5>
                    <hr />
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                value={newObject.email}
                                onChange={(e) => setNewObject({ ...newObject, email: e.target.value })}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <select
                                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                id="role"
                                value={newObject.role}
                                onChange={(e) => setNewObject({ ...newObject, role: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="CSR">CSR</option>
                                <option value="Vendor">Vendor</option>
                            </select>
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                        </div>
                        {!info.editBtn && (
                            <div className="col-md-12 mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    value={newObject.password}
                                    onChange={(e) => setNewObject({ ...newObject, password: e.target.value })}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                        )}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                id="status"
                                value={newObject.status}
                                onChange={(e) => setNewObject({ ...newObject, status: e.target.value })}
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                            {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;

