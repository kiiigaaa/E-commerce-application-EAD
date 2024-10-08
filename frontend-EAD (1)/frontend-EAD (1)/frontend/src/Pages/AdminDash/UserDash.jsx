import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../../Components/SideBar/SideBar.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import configs from '../../config.js';
import { Button, Table } from 'react-bootstrap';

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
                });
            });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <SideBar />
            <div style={{ flexGrow: 1, padding: 20, backgroundColor: '#ecf0f1', display: 'flex', flexDirection: 'column' }}>
                <nav className="navbar navbar-dark bg-dark mb-4">
                    <div className="container-fluid">
                        <span className="navbar-brand">User Management</span>
                        <Button variant="primary" as={NavLink} to="/addUser">
                            Add New User
                        </Button>
                    </div>
                </nav>

                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        maxWidth: '161vh',
                    }}
                >
                    <h5 className="mb-4">User Details</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Modified Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {post.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.email}</td>
                                    <td>{row.role}</td>
                                    <td>
                                        {row.status === 'Active' ? (
                                            <Button variant="success" size="sm">
                                                {row.status}
                                            </Button>
                                        ) : (
                                            <Button variant="danger" size="sm">
                                                {row.status}
                                            </Button>
                                        )}
                                    </td>
                                    <td>{row.createdDate}</td>
                                    <td>{row.modifiedDate}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(row)}>
                                            Edit
                                        </Button>
                                        {' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.userId)}>
                                            Delete
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

export default UserDash;

