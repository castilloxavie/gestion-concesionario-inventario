import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import applicationServices from "../../services/applicationServices";
import "../../styles/dashboard.css";

const ApplicationsPage = () => {
    const { token, user } = useAuth();
    
    // Verificar si es administrador
    const isAdmin = user?.role === "admin";
    
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({
        marca: "",
        sucursal: "",
        aspirante: ""
    });
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationServices.getAllApplications(token);
            setApplications(data.applications || []);
        } catch (err) {
            console.error("Error al cargar aplicaciones:", err);
            setError("Error al cargar aplicaciones");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            if (editingApp) {
                await applicationServices.updateApplication(editingApp.id, formData, token);
            } else {
                await applicationServices.createApplication(formData, token);
            }
            
            setShowModal(false);
            setEditingApp(null);
            setFormData({ marca: "", sucursal: "", aspirante: "" });
            loadApplications();
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.detail || "Error al guardar aplicación");
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setFormData({
            marca: app.marca,
            sucursal: app.sucursal,
            aspirante: app.aspirante
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await applicationServices.deleteApplication(id, token);
            loadApplications();
        } catch (err) {
            console.error("Error al eliminar:", err);
            setError("Error al eliminar aplicación");
        }
        setConfirmAction(null);
    };

    const openCreateModal = () => {
        setEditingApp(null);
        setFormData({ marca: "", sucursal: "", aspirante: "" });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingApp(null);
        setFormData({ marca: "", sucursal: "", aspirante: "" });
    };

    // Funciones para edición directa
    const handleEditClick = (app) => {
        setEditingApp(app);
        setFormData({
            marca: app.marca,
            sucursal: app.sucursal,
            aspirante: app.aspirante
        });
    };

    const handleDeleteClick = (id) => {
        setConfirmAction({ id: id, type: 'delete' });
    };

    const confirmEdit = async () => {
        try {
            await applicationServices.updateApplication(editingApp.id, formData, token);
            setEditingApp(null);
            setFormData({ marca: "", sucursal: "", aspirante: "" });
            loadApplications();
        } catch (err) {
            console.error("Error al editar:", err);
            setError(err.response?.data?.detail || "Error al editar aplicación");
        }
        setConfirmAction(null);
    };

    const confirmDelete = () => {
        if (confirmAction && confirmAction.type === 'delete') {
            handleDelete(confirmAction.id);
        }
        setConfirmAction(null);
    };

    const cancelAction = () => {
        setConfirmAction(null);
    };

    const cancelEdit = () => {
        setEditingApp(null);
        setFormData({ marca: "", sucursal: "", aspirante: "" });
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-watermark">
                    <img src="/portada3.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="dashboard-loading">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Marca de agua */}
            <img 
                src="/portada3.png" 
                alt="" 
                className="dashboard-watermark"
            />

            <div className="dashboard-main">
                {/* Panel Izquierdo - Formulario */}
                <div className="dashboard-sidebar">
                    <div className="dashboard-card">
                        <h3 className="dashboard-card-title">
                            <span className="icon" onClick={() => setShowModal(true)} style={{cursor: 'pointer', backgroundImage: 'url(/agregar.png)'}}></span>
                        </h3>
                        
                        {error && <div className="dashboard-error">{error}</div>}
                        
                        <form className="dashboard-form" onSubmit={handleSubmit}>
                            <div className="dashboard-form-group">
                                <div className="dashboard-form-icon">
                                    <img src="/marca.png" alt="marca" style={{width: '20px', height: '20px'}} />
                                </div>
                                <input 
                                    type="text" 
                                    className="dashboard-input"
                                    value={formData.marca}
                                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                                    placeholder="Mazda"
                                    required
                                />
                            </div>
                            
                            <div className="dashboard-form-group">
                                <div className="dashboard-form-icon">
                                    <img src="/localizacion.png" alt="localizacion" style={{width: '20px', height: '20px'}} />
                                </div>
                                <input 
                                    type="text" 
                                    className="dashboard-input"
                                    value={formData.sucursal}
                                    onChange={(e) => setFormData({...formData, sucursal: e.target.value})}
                                    placeholder="Chapinero"
                                    required
                                />
                            </div>
                            
                            <div className="dashboard-form-group">
                                <div className="dashboard-form-icon">
                                    <img src="/aspirante.png" alt="aspirante" style={{width: '20px', height: '20px'}} />
                                </div>
                                <input 
                                    type="text" 
                                    className="dashboard-input"
                                    value={formData.aspirante}
                                    onChange={(e) => setFormData({...formData, aspirante: e.target.value})}
                                    placeholder="David Sandoval"
                                    required
                                />
                            </div>

                            {/* Botones de edición - aparecen cuando se está editando */}
                            {editingApp && (
                                <div className="dashboard-confirm-buttons" style={{ 
                                    display: 'flex', 
                                    gap: '10px', 
                                    marginTop: '10px',
                                    padding: '10px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                        Editando... ¿Guardar cambios?
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <button 
                                            onClick={confirmEdit}
                                            title="Guardar cambios"
                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                        >
                                            <img src="/aprobar_eliminacion_editar.png" alt="guardar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            title="Cancelar edición"
                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                        >
                                            <img src="/negar_eliminacion_editar.png" alt="cancelar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Botones de confirmación de eliminación */}
                            {confirmAction && confirmAction.type === 'delete' && (
                                <div className="dashboard-confirm-buttons" style={{ 
                                    display: 'flex', 
                                    gap: '10px', 
                                    marginTop: '10px',
                                    padding: '10px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                                        ¿Confirmar eliminación?
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <button 
                                            onClick={confirmDelete}
                                            title="Confirmar eliminación"
                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                        >
                                            <img src="/aprobar_eliminacion_editar.png" alt="confirmar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                        </button>
                                        <button 
                                            onClick={cancelAction}
                                            title="Cancelar"
                                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                        >
                                            <img src="/negar_eliminacion_editar.png" alt="cancelar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {!editingApp && !confirmAction && showModal && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: 'transparent',
                                            color: '#C6007E',
                                            border: '2px solid #C6007E',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: 'transparent',
                                            color: '#00249C',
                                            border: '2px solid #00249C',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Crear
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Panel Derecho - Tabla */}
                <div className="dashboard-content">
                    <div className="dashboard-table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Sucursal</th>
                                    <th>Aspirante</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td>{app.marca}</td>
                                        <td>{app.sucursal}</td>
                                        <td>
                                            <div className="dashboard-actions-inline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <span>{app.aspirante}</span>
                                                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                                    <button 
                                                        className="dashboard-btn-action dashboard-btn-approve"
                                                        onClick={() => handleEditClick(app)}
                                                        title="Editar"
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                                    >
                                                        <img src="/editar.png" alt="editar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                                    </button>
                                                    {isAdmin && (
                                                        <button 
                                                            className="dashboard-btn-action dashboard-btn-reject"
                                                            onClick={() => handleDeleteClick(app.id)}
                                                            title="Eliminar"
                                                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', background: 'transparent' }}
                                                        >
                                                            <img src="/eliminar.png" alt="eliminar" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                                            No hay solicitudes registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <button 
                    onClick={() => navigate("/")}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        fontSize: '12px',
                        color: '#888',
                        textDecoration: 'underline'
                    }}
                >
                    ← Volver al Dashboard
                </button>
                <img src="/pie_pagina.png" alt="pie de pagina" style={{maxWidth: '200px'}} />
            </footer>
        </div>
    );
};

export default ApplicationsPage;
