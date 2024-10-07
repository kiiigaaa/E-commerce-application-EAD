import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import { NavLink } from 'react-router-dom';
import configs from '../../config.js';
import { Rating } from '@mui/material';

const VendorDash = () => {
    const [post, setPost] = useState([]);
    const [open, setOpen] = useState(false);
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
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        { field: 'vendorName', headerName: 'Vendor Name', width: 250 },
        {
            field: 'averageRating', headerName: 'Average Rating', width: 200, renderCell: (params) => (
                <Rating value={params.value} readOnly precision={0.5} />
            )
        },
        {
            field: 'comments', headerName: 'Comments', width: 200, renderCell: (params) => (
                <Button onClick={() => handleOpenComments(params.row.customerComments)} variant="outlined">
                    View Comments
                </Button>
            )
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
                            Vendor Feedback Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        {userRole === 'Admin' && (
                            <Button
                                sx={{ marginRight: '10px' }}
                                variant="contained"
                                color="primary"
                                component={NavLink}
                                to="/addVendor"
                            >
                                Add Vendor Feedback
                            </Button>
                        )}
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
                        Vendor Feedback
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Customer Comments</DialogTitle>
                    <DialogContent>
                        {currentComments.map((comment, index) => (
                            <Typography key={index} paragraph>
                                <strong>Date:</strong> {new Date(comment.commentDate).toLocaleString()}<br />
                                <Rating value={comment.rating} readOnly precision={0.5} name='Rating' /> <br />
                                <strong>Comment:</strong> {comment.comment}
                            </Typography>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default VendorDash;
