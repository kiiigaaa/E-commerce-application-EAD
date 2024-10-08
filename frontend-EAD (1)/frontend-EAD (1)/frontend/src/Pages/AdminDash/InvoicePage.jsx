import { useState, useEffect } from 'react';
import { Table, Button, Navbar, Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import configs from '../../config.js';

const InvoicePage = () => {
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    // Fetch only delivered orders
    const fetchDeliveredOrders = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/Order/GetAllOrders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const delivered = response.data.filter(order => order.orderStatus === 'Delivered');
            setDeliveredOrders(delivered);
        } catch (error) {
            console.error('Error fetching delivered orders:', error);
            Swal.fire({
                title: 'Error fetching delivered orders!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Generate and print invoice
    const handlePrintInvoice = (order) => {
        const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
        const invoiceContent = `
            <html>
                <head>
                    <title>Invoice for Order ${order.orderID}</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        table, th, td { border: 1px solid black; padding: 10px; text-align: left; }
                    </style>
                </head>
                <body>
                    <h2>Invoice for Order ${order.orderID}</h2>
                    <table>
                        <tr><th>Vendor ID</th><td>${order.vendorID}</td></tr>
                        <tr><th>Customer ID</th><td>${order.customerID}</td></tr>
                        <tr><th>Product ID</th><td>${order.productID}</td></tr>
                        <tr><th>Quantity</th><td>${order.quantity}</td></tr>
                        <tr><th>Price</th><td>${order.totalPrice}</td></tr>
                        <tr><th>Order Status</th><td>${order.orderStatus}</td></tr>
                        <tr><th>Delivery Date</th><td>${order.deliveryDate}</td></tr>
                    </table>
                    <h3>Total Amount: ${order.totalPrice * order.quantity}</h3>
                    <p>Thank you for your order!</p>
                </body>
            </html>
        `;
        invoiceWindow.document.write(invoiceContent);
        invoiceWindow.document.close();
        invoiceWindow.print();
    };

    // Download report of delivered orders as CSV
    const downloadReport = () => {
        const csvContent = `data:text/csv;charset=utf-8,Order ID,Vendor ID,Customer ID,Product ID,Quantity,Total Price,Delivery Date\n` +
            deliveredOrders.map(order => `${order.orderID},${order.vendorID},${order.customerID},${order.productID},${order.quantity},${order.totalPrice * order.quantity},${order.deliveryDate}`).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'delivered_orders_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <Navbar.Brand>Invoice Management</Navbar.Brand>
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
                    <h5>Delivered Orders</h5>
                    <Button variant="success" onClick={downloadReport} style={{ marginBottom: '20px' }}>
                        Download Report
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Vendor ID</th>
                                <th>Customer ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Delivery Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredOrders.map((order) => (
                                <tr key={order.orderID}>
                                    <td>{order.orderID}</td>
                                    <td>{order.vendorID}</td>
                                    <td>{order.customerID}</td>
                                    <td>{order.productID}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.totalPrice * order.quantity}</td>
                                    <td>{order.deliveryDate}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handlePrintInvoice(order)}>
                                            Print Invoice
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
