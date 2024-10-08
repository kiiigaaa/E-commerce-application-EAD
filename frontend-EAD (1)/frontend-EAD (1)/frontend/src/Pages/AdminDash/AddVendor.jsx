import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import configs from '../../config.js';
import { Container, Form, Button, Row, Col, Navbar } from 'react-bootstrap';

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
                );
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

        if (!newObject.vendorName.trim()) {
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
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand>Add Vendor</Navbar.Brand>
                    <div className="ml-auto">
                        <Button variant="primary" onClick={handleAdd}>Add Vendor</Button>
                        <Button variant="danger" onClick={handleCancel} className="ml-2">Cancel</Button>
                    </div>
                </Container>
            </Navbar>
            <Container style={{ marginTop: '80px' }}>
                <div className="p-4 bg-white rounded shadow-sm">
                    <Form>
                        <Row>
                            <Col xs={12}>
                                <h5 className="mb-4">Vendor Form</h5>
                                <Form.Group controlId="formVendorName">
                                    <Form.Label>Vendor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter vendor name"
                                        value={newObject.vendorName}
                                        onChange={(e) => setNewObject({ ...newObject, vendorName: e.target.value })}
                                        isInvalid={!!errors.vendorName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.vendorName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr />
                        <Button variant="primary" onClick={handleAdd}>
                            Add Vendor
                        </Button>
                        <Button variant="danger" onClick={handleCancel} className="ml-2">
                            Cancel
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default AddVendor;

