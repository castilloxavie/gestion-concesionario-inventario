import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authServices from "../../services/authServices";
import "../../styles/users.css";

const UsersPage = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    
    // FORZAR que isAdmin sea false inicialmente para usuarios normales
    // Solo será true si el rol es exactamente "admin"
    let isAdmin = false;
    if (user && user.role === "admin") {
        isAdmin = true;
    }
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role_name: "user",
        is_active: true
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await authServices.getAllUsers(token);
            setUsers(data.users || []);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            if (editingUser) {
                const updateData = {
                    email: formData.email,
                    is_active: formData.is_active
                };
                if (formData.role_name) {
                    updateData.role_name = formData.role_name;
                }
                await authServices.updateUser(editingUser.id, updateData, token);
            } else {
                await authServices.registerByAdmin(
                    formData.email, 
                    formData.password, 
                    formData.role_name, 
                    token
                );
            }
            
            setShowModal(false);
            setEditingUser(null);
            setFormData({ email: "", password: "", role_name: "user", is_active: true });
            loadUsers();
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.detail || "Error al guardar usuario");
        }
    };

    const handleEdit = (u) => {
        setEditingUser(u);
        setFormData({
            email: u.email,
            password: "",
            role_name: u.role,
            is_active: u.is_active
        });
        setShowModal(true);
    };

    const handleDelete = (userId) => {
        // VERIFICACIÓN EXTRA - SI NO ES ADMIN, NO HACER NADA
        if (user?.role !== "admin") {
            alert("ACCESO DENEGADO: No tienes permisos de administrador");
            return;
        }
        
        if (!confirm("¿Está seguro de eliminar este usuario?")) return;
        
        authServices.deleteUser(userId, token)
            .then(() => loadUsers())
            .catch((err) => {
                console.error("Error al eliminar:", err);
                setError("Error al eliminar usuario");
            });
    };

    const handleToggleActive = async (u) => {
        try {
            await authServices.updateUser(
                u.id, 
                { is_active: !u.is_active }, 
                token
            );
            loadUsers();
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            setError("Error al cambiar estado del usuario");
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ email: "", password: "", role_name: "user", is_active: true });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: "", password: "", role_name: "user", is_active: true });
    };

    if (loading) {
        return (
            <div className="users-container">
                <div className="users-loading">Cargando...</div>
            </div>
        );
    }

    // DEBUG: Mostrar información
    const debugInfo = `DEBUG: user.role = "${user?.role}" | isAdmin = ${isAdmin}`;

    return (
        <div className="users-container">
            {/* Barra de debug */}
            <div style={{padding: '10px 20px', background: '#333', color: '#fff', fontSize: '14px', textAlign: 'center'}}>
                {debugInfo}
            </div>

            <img 
                src="/portada3.png" 
                alt="" 
                className="dashboard-watermark"
            />

            <div className="users-header">
                <h2 className="users-title">Gestión de Usuarios</h2>
                <button 
                    className="users-back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Volver al Dashboard
                </button>
            </div>

            <div className="users-main">
                {error && <p className="users-error">{error}</p>}
                
                {/* Solo admins ven el botón de crear */}
                {isAdmin && (
                    <button 
                        className="users-new-btn"
                        onClick={openCreateModal}
                    >
                        + Nuevo Usuario
                    </button>
                )}

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.email}</td>
                                    <td>{u.role === "admin" ? "Administrador" : "Usuario"}</td>
                                    <td>
                                        <span className={`users-status ${u.is_active ? "users-status-active" : "users-status-inactive"}`}>
                                            {u.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="users-actions">
                                            <button 
                                                className="users-action-btn users-action-btn-edit"
                                                onClick={() => handleEdit(u)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button 
                                                className="users-action-btn users-action-btn-toggle"
                                                onClick={() => handleToggleActive(u)}
                                            >
                                                {u.is_active ? "⏸️" : "▶️"}
                                            </button>
                                            
                                            {/* BOTÓN DE ELIMINAR - SÓLO PARA ADMIN */}
                                            {isAdmin ? (
                                                <button 
                                                    className="users-action-btn users-action-btn-delete"
                                                    onClick={() => handleDelete(u.id)}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            ) : (
                                                <span style={{color: '#999', fontSize: '11px', padding: '8px', border: '1px dashed #ccc', borderRadius: '4px'}}>
                                                    🔒 Solo admin puede eliminar
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                                        No hay usuarios registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="users-footer">
                <img src="/pie_pagina.png" alt="pie de pagina" style={{maxWidth: '200px'}} />
            </footer>

            {/* MODAL - SOLO PARA ADMINS */}
            {showModal && isAdmin && (
                <div className="users-modal-overlay" onClick={closeModal}>
                    <div className="users-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="users-modal-title">
                            {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="users-form-group">
                                <label className="users-form-label">Email:</label>
                                <input 
                                    type="email" 
                                    className="users-form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                            
                            {!editingUser && (
                                <div className="users-form-group">
                                    <label className="users-form-label">Contraseña:</label>
                                    <input 
                                        type="password" 
                                        className="users-form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required={!editingUser}
                                        minLength={8}
                                    />
                                </div>
                            )}
                            
                            <div className="users-form-group">
                                <label className="users-form-label">Rol:</label>
                                <select 
                                    className="users-form-input"
                                    value={formData.role_name}
                                    onChange={(e) => setFormData({...formData, role_name: e.target.value})}
                                >
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            
                            {editingUser && (
                                <div className="users-form-checkbox">
                                    <input 
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    />
                                    <label htmlFor="is_active">Usuario activo</label>
                                </div>
                            )}
                            
                            <div className="users-form-buttons">
                                <button 
                                    type="button"
                                    className="users-form-btn users-form-btn-cancel"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="users-form-btn users-form-btn-submit"
                                >
                                    {editingUser ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
