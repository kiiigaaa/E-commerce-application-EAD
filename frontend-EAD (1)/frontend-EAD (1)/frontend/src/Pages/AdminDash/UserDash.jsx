import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import configs from '../../config.js';

const UserDash = () => {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchDetails();
        const editBtn = false;
        const data = { editBtn };
        localStorage.setItem('userAdmin', JSON.stringify(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${configs.apiUrl}/User/GetAllUsers`, {
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
        localStorage.setItem('userAdmin', JSON.stringify(data));
        navigate('/addUser');
    };

    const handleDelete = (id) => {
        axios
            .delete(`${configs.apiUrl}/User/DeleteUser?userId=${id}`, {
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
                    type: 'success',
                });
            });
    };

    const columns = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'status', headerName: 'Status', width: 150,
            renderCell: (params) => (
                <div>
                    {params.value === 'Active' ? (
                        <Button variant="contained" color="success">
                            {params.value}
                        </Button>
                    ) : (
                        <Button variant="contained" color="error">
                            {params.value}
                        </Button>
                    )}
                </div>
            ),
        },
        { field: 'createdDate', headerName: 'Created Date', width: 200 },
        { field: 'modifiedDate', headerName: 'Modified Date', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.userId)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
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
                            User Management
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button
                            sx={{ marginRight: '10px' }}
                            variant="contained"
                            color="primary"
                            component={NavLink}
                            to="/addUser"
                        >
                            Add New User
                        </Button>
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
                        User Details
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <DataGrid rows={post} columns={columns} pageSize={5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDash;
