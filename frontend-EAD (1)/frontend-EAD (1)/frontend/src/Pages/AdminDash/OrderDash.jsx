import { useState, useEffect } from 'react';
import { Table, Button, Modal, Navbar, Form, Container } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import configs from '../../config.js';

const OrderDash = () => {
    const [post, setPost] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState({});
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem("userRole");

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/Order/GetAllOrders`, {
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

    const handleCancell = () => {
        axios
            .put(`${configs.apiUrl}/Order/CancelOrder?orderId=${currentOrder.orderID}&reason=${currentOrder.cancellationReason}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchDetails();
                setShowCancelModal(false);
            })
            .catch((error) => {
                console.error('Failed to update order status:', error);
                Swal.fire({
                    title: 'Error updating order!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    const handleEditClick = (order) => {
        setCurrentOrder(order);
        setShowEditModal(true);
    };

    const handleCancellClick = (order) => {
        setCurrentOrder(order);
        setShowCancelModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseCancelModal = () => setShowCancelModal(false);

    const handleStatusChange = (event) => {
        setCurrentOrder({ ...currentOrder, orderStatus: event.target.value });
    };

    const handleUpdate = () => {
        axios
            .put(`${configs.apiUrl}/Order/UpdateOrder`, currentOrder, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchDetails();
                setShowEditModal(false);
            })
            .catch((error) => {
                console.error('Failed to update order status:', error);
                Swal.fire({
                    title: 'Error updating order!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div
                style={{
                    flexGrow: 1,
                    padding: 20,
                    backgroundColor: '#ecf0f1',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand>Order Management</Navbar.Brand>
                    </Container>
                </Navbar>

                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '161vh',
                    }}
                >
                    <h5>Order Details</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Vendor ID</th>
                                <th>Customer ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                                <th>Cancellation Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.vendorID}</td>
                                    <td>{order.customerID}</td>
                                    <td>{order.productID}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        <Button
                                            variant={
                                                order.orderStatus === 'Processing' ? 'warning'
                                                    : order.orderStatus === 'Ready' ? 'success'
                                                    : order.orderStatus === 'Partially Delivered' ? 'secondary'
                                                    : order.orderStatus === 'Delivered' ? 'primary'
                                                    : 'danger'
                                            }
                                            disabled
                                        >
                                            {order.orderStatus}
                                        </Button>
                                    </td>
                                    <td>{order.deliveryDate}</td>
                                    <td>{order.cancellationReason}</td>
                                    <td>
                                        {(userRole === 'Admin' || userRole === 'CSR') && (
                                            <>
                                                {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                                                    <Button variant="primary" onClick={() => handleEditClick(order)}>
                                                        <PencilSquare />
                                                    </Button>
                                                )}
                                                {(order.orderStatus === 'Processing' || order.orderStatus === 'Ready') && (
                                                    <Button variant="danger" onClick={() => handleCancellClick(order)}>
                                                        <Trash />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Edit Modal */}
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Order Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="statusSelect">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={currentOrder.orderStatus || ''}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Partially Delivered">Partially Delivered</option>
                                    <option value="Delivered">Delivered</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Cancel Modal */}
                <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancel Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="reasonText">
                                <Form.Label>Reason</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentOrder.cancellationReason || ''}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, cancellationReason: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCancelModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleCancell}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default OrderDash;
