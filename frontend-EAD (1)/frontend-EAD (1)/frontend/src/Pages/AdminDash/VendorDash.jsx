import { useState, useEffect } from 'react';
import { Table, Button, Modal, Navbar, Container, Nav } from 'react-bootstrap';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import { NavLink } from 'react-router-dom';
import configs from '../../config.js';
import { FaStar } from 'react-icons/fa';

const VendorDash = () => {
    const [post, setPost] = useState([]);
    const [show, setShow] = useState(false);
    const [currentComments, setCurrentComments] = useState([]);
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem("userRole");

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/Vendor/GetAllVendors`, {
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

    const handleOpenComments = (comments) => {
        setCurrentComments(comments);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand>Vendor Feedback Management</Navbar.Brand>
                        <Nav className="ml-auto">
                            {userRole === 'Admin' && (
                                <Button as={NavLink} to="/addVendor" variant="primary">
                                    Add Vendor Feedback
                                </Button>
                            )}
                        </Nav>
                    </Container>
                </Navbar>

                <div style={{ padding: 20, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}>
                    <h5>Vendor Feedback</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Average Rating</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.vendorName}</td>
                                    <td>
                                        {[...Array(Math.floor(row.averageRating))].map((star, i) => (
                                            <FaStar key={i} color="gold" />
                                        ))}
                                        {row.averageRating % 1 !== 0 && <FaStar color="gold" half />}
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" onClick={() => handleOpenComments(row.customerComments)}>
                                            View Comments
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Customer Comments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentComments.map((comment, index) => (
                            <div key={index}>
                                <strong>Date:</strong> {new Date(comment.commentDate).toLocaleString()}<br />
                                <strong>Rating:</strong> {[...Array(Math.floor(comment.rating))].map((star, i) => (
                                    <FaStar key={i} color="gold" />
                                ))}
                                <br />
                                <strong>Comment:</strong> {comment.comment}
                                <hr />
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default VendorDash;

