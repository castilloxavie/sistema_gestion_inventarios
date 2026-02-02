import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createUser, deleteUser, getUsers, updateUser } from '../../services/userServices';
import Modal from '../../components/Modal';

import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'vendedor'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (error) {
            setError('Error al cargar usuarios');
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            await loadUsers();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError(error.response?.data?.error || 'Error al guardar usuario');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            password: '', // No mostrar contraseña existente
            rol: user.rol
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await deleteUser(id);
                await loadUsers();
            } catch {
                setError('Error al eliminar usuario');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            rol: 'vendedor'
        });
        setEditingUser(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const getRoleLabel = (rol) => {
        switch (rol) {
            case 'admin': return 'Administrador';
            case 'vendedor': return 'Vendedor';
            case 'auditoria': return 'Auditoría';
            default: return rol;
        }
    };

    if (loading) return <div className="loading">Cargando usuarios...</div>;

    return (
        <div className="user-management">
            <div className="header">
                <h2>Gestión de Usuarios</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button className="btn-primary" onClick={openCreateModal}>
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.nombre}</td>
                                <td>{user.apellido}</td>
                                <td>{user.email}</td>
                                <td>{getRoleLabel(user.rol)}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="user-form">
                    <h3>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Apellido:</label>
                            <input
                                type="text"
                                value={formData.apellido}
                                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        {!editingUser && (
                            <div className="form-group">
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required={!editingUser}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Rol:</label>
                            <select
                                value={formData.rol}
                                onChange={(e) => setFormData({...formData, rol: e.target.value})}
                                required
                            >
                                <option value="vendedor">Vendedor</option>
                                <option value="admin">Administrador</option>
                                <option value="auditoria">Auditoría</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingUser ? 'Actualizar' : 'Crear'}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;
