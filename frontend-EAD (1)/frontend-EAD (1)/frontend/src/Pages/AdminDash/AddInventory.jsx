import { useState, useEffect } from 'react';
import { Container, Form, Button, Navbar } from 'react-bootstrap';
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
    }, [info]);

    const handleAdd = async () => {
        if (validateForm()) {
            try {
                await axios.post(
                    `${configs.apiUrl}/Inventory/CreateInventory`, newObject,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
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
        };
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
                    text: "Failed to update or stock is exceeded.",
                    icon: 'error',
                    confirmButtonText: "OK"
                });
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!newObject.productName.trim()) {
            errors.productName = 'Product Name is required';
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
        <div className="bg-light" style={{ height: '100vh', paddingTop: '56px' }}>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand>{info.editBtn ? 'Edit Inventory' : 'Add Inventory'}</Navbar.Brand>
                    <Button variant="primary" onClick={info.editBtn ? handleEdit : handleAdd}>
                        {info.editBtn ? 'Edit Inventory' : 'Add Inventory'}
                    </Button>
                    <Button variant="danger" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <div className="bg-white p-4 rounded shadow-sm">
                    <h4>Inventory Form</h4>
                    <hr />
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={newObject.productName}
                                onChange={(e) => setNewObject({ ...newObject, productName: e.target.value })}
                                isInvalid={!!errors.productName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.productName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock Level</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter stock level"
                                value={newObject.stockLevel}
                                onChange={(e) => setNewObject({ ...newObject, stockLevel: e.target.value })}
                                isInvalid={!!errors.stockLevel}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.stockLevel}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Low Stock Threshold</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter low stock threshold"
                                value={newObject.lowStockThreshold}
                                onChange={(e) => setNewObject({ ...newObject, lowStockThreshold: e.target.value })}
                                isInvalid={!!errors.lowStockThreshold}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lowStockThreshold}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default AddInventory;

