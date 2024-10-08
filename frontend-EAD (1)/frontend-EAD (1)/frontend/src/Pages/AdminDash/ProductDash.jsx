import { useState, useEffect } from 'react';
import { Table, Button, Container, Navbar, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import configs from '../../config.js';

const ProductDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');

    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = { editBtn };
        localStorage.setItem('productAdmin', JSON.stringify(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/Product/GetAllProducts`, {
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
        localStorage.setItem('productAdmin', JSON.stringify(data));
        navigate('/addProduct');
    };

    const handleDelete = (id) => {
        axios
            .delete(`${configs.apiUrl}/Product/DeleteProduct?productId=${id}`, {
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
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand>Product Management</Navbar.Brand>
                        <Navbar.Collapse className="justify-content-end">
                            {(userRole === 'Admin' || userRole === 'Vendor') && (
                                <Button variant="primary" onClick={() => navigate('/addProduct')}>
                                    Add New Product
                                </Button>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Container style={{ marginTop: '20px', backgroundColor: '#ffffff', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <h5>Product Details</h5>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Level</th>
                                <th>Status</th>
                                <th>Vendor ID</th>
                                <th>Created Date</th>
                                <th>Modified Date</th>
                                {(userRole === 'Admin' || userRole === 'Vendor') && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.productName}</td>
                                    <td>{row.description}</td>
                                    <td>{row.category}</td>
                                    <td>{row.price}</td>
                                    <td>{row.stockLevel}</td>
                                    <td>
                                        <Button variant={row.status === 'Active' ? 'success' : 'danger'}>
                                            {row.status}
                                        </Button>
                                    </td>
                                    <td>{row.vendorID}</td>
                                    <td>{row.createdDate}</td>
                                    <td>{row.modifiedDate}</td>
                                    {(userRole === 'Admin' || userRole === 'Vendor') && (
                                        <td>
                                            <Button variant="primary" onClick={() => handleEdit(row)} style={{ marginRight: '10px' }}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDelete(row.productID)}>
                                                Delete
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </div>
    );
};

export default ProductDash;

