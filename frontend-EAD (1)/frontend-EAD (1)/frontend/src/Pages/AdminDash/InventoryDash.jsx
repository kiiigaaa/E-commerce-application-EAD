import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, NavLink } from 'react-router-dom';
import configs from '../../config.js';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import { Container, Table, Button, Navbar, Nav } from 'react-bootstrap';

const InventoryDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem("userRole");

    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = { editBtn };
        localStorage.setItem('inventoryAdmin', JSON.stringify(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/Inventory/GetAllInventories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const postWithId = response.data.map((post, index) => ({
                id: index + 1,
                ...post,
            }));
            setPost(postWithId);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleEdit = (row) => {
        const editBtn = true;
        const data = { row, editBtn };
        localStorage.setItem('inventoryAdmin', JSON.stringify(data));
        navigate('/addInventory');
    };

    const handleDelete = (id) => {
        axios
            .delete(`${configs.apiUrl}/Inventory/DeleteInventory?inventoryId=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchDetails();
            })
            .catch(() => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Not Delete',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand>Inventory Management</Navbar.Brand>
                    <Nav className="ml-auto">
                        {(userRole === 'Admin' || userRole === 'CSR') && (
                            <Button as={NavLink} to="/addInventory" variant="primary" style={{ marginLeft: '10px' }}>
                                Add New Inventory
                            </Button>
                        )}
                    </Nav>
                </Navbar>

                <Container style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '20px' }}>
                    <h5>Inventory Details</h5>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product</th>
                                <th>Stock Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((row) => (
                                <tr key={row.inventoryId}>
                                    <td>{row.productID}</td>
                                    <td>{row.productName}</td>
                                    <td>{row.stockLevel}</td>
                                    <td>
                                        {(userRole === 'Admin' || userRole === 'CSR') && (
                                            <>
                                                <Button variant="link" onClick={() => handleEdit(row)}>Edit</Button>
                                                <Button variant="link" className="text-danger" onClick={() => handleDelete(row.inventoryId)}>Delete</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </div>
    );
};

export default InventoryDash;

