import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Navbar } from 'react-bootstrap';
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
    }, [info]);

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
        };
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
    };

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
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand>{info.editBtn ? "Edit Product" : "Add Product"}</Navbar.Brand>
                    <div className="ml-auto">
                        {info.editBtn ? (
                            <Button variant="primary" onClick={handleEdit}>Edit Product</Button>
                        ) : (
                            <Button variant="primary" onClick={handleAdd}>Add Product</Button>
                        )}
                        <Button variant="danger" onClick={handleCancel} className="ml-2">Cancel</Button>
                    </div>
                </Container>
            </Navbar>

            <Container style={{ marginTop: '100px' }}>
                <div className="bg-white p-4 rounded shadow-sm">
                    <Form>
                        {!info.editBtn && (
                            <Form.Group controlId="productID">
                                <Form.Label>Product ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newObject.productID}
                                    onChange={(e) => setNewObject({ ...newObject, productID: e.target.value })}
                                    isInvalid={!!errors.productID}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.productID}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <Form.Group controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newObject.productName}
                                onChange={(e) => setNewObject({ ...newObject, productName: e.target.value })}
                                isInvalid={!!errors.productName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.productName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={newObject.description}
                                onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={newObject.category}
                                onChange={(e) => setNewObject({ ...newObject, category: e.target.value })}
                                isInvalid={!!errors.category}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.category}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={newObject.price}
                                onChange={(e) => setNewObject({ ...newObject, price: e.target.value })}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.price}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {!info.editBtn && (
                            <Form.Group controlId="stockLevel">
                                <Form.Label>Stock Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newObject.stockLevel}
                                    onChange={(e) => setNewObject({ ...newObject, stockLevel: e.target.value })}
                                    isInvalid={!!errors.stockLevel}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.stockLevel}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={newObject.status}
                                onChange={(e) => setNewObject({ ...newObject, status: e.target.value })}
                                isInvalid={!!errors.status}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.status}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="vendorID">
                            <Form.Label>Vendor ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={newObject.vendorID}
                                onChange={(e) => setNewObject({ ...newObject, vendorID: e.target.value })}
                                isInvalid={!!errors.vendorID}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.vendorID}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default AddProduct;

