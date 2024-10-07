import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import configs from '../../config.js';
import { TextField } from '@material-ui/core';

const OrderDash = () => {
    const [post, setPost] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
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
                setOpen2(false);
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
        setOpen(true);
    };

    const handleCancellClick = (order) => {
        setCurrentOrder(order);
        setOpen2(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

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
                setOpen(false);
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

    const columns = [
        { field: 'vendorID', headerName: 'Vendor ID', width: 210 },
        { field: 'customerID', headerName: 'Customer ID', width: 210 },
        { field: 'productID', headerName: 'Product ID', width: 210 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'totalPrice', headerName: 'Price', width: 150 },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 220,
            renderCell: (params) => (
                <div>
                    {params.value === 'Processing' && (
                        <Button variant="contained" color="warning">
                            {params.value}
                        </Button>
                    )}
                    {params.value === 'Ready' && (
                        <Button variant="contained" color="success">
                            {params.value}
                        </Button>
                    )}
                    {params.value === 'Partially Delivered' && (
                        <Button variant="contained" style={{ backgroundColor: 'orange' }}>
                            {params.value}
                        </Button>
                    )}
                    {params.value === 'Delivered' && (
                        <Button variant="contained" color="primary">
                            {params.value}
                        </Button>
                    )}
                    {params.value === 'Cancelled' && (
                        <Button variant="contained" color="error">
                            {params.value}
                        </Button>
                    )}
                </div>
            )
        },
        { field: 'deliveryDate', headerName: 'Delivery Date', width: 150 },
        { field: 'cancellationReason', headerName: 'Cancellation Reason', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                (userRole === 'Admin' || userRole === 'CSR') && (
                    <div>
                        {params.row.orderStatus !== 'Cancelled' && params.row.orderStatus !== 'Delivered' ? (
                            <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
                                <EditIcon />
                            </IconButton>
                        ) : <Button color='primary' disabled>No Actions</Button>}
                        {params.row.orderStatus === 'Processing' || params.row.orderStatus === 'Ready' ? (
                            <IconButton color="error" onClick={() => handleCancellClick(params.row)}>
                                <DeleteIcon />
                            </IconButton>
                        ) :
                            null}

                    </div>
                )

            ),
        },
    ];

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
                <AppBar position="static" sx={{ backgroundColor: '#1c2331', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div">
                            Order Management
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '161vh',
                    }}
                >
                    <Typography variant="h5" gutterBottom color={'black'}>
                        Order Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={currentOrder.orderStatus || ''}
                                label="Status"
                                onChange={handleStatusChange}
                            >
                                <MenuItem value="Processing">Processing</MenuItem>
                                <MenuItem value="Ready">Ready</MenuItem>
                                <MenuItem value="Partially Delivered">Partially Delivered</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleUpdate}>Update</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={open2} onClose={handleClose2}>
                    <DialogTitle>Cancell Order</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <TextField
                                label="Reason"
                                fullWidth
                                value={currentOrder.cancellationReason || ''}
                                onChange={(e) => setCurrentOrder({ ...currentOrder, cancellationReason: e.target.value })}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose2}>Cancel</Button>
                        <Button onClick={handleCancell}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default OrderDash;
