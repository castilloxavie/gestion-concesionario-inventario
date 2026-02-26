import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authServices from "../../services/authServices";
import "../../styles/dashboard.css";

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", roleName: "user" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [usersCreated, setUsersCreated] = useState({ admin: false, user: false });

  // Verificar si es usuario seed
  const isSeed = user?.is_seed === true;

  // Verificar si es admin (pero NO seed)
  const isAdmin = user?.role === "admin" && !isSeed;

  // Verificar si el seed ya creó ambos usuarios
  const bothUsersCreated = usersCreated.admin && usersCreated.user;

  // Si el seed creó ambos usuarios, cerrar sesión
  useEffect(() => {
    if (isSeed && bothUsersCreated) {
      const timer = setTimeout(() => {
        alert("Has creado los usuarios inicial. Se cerrará la sesión.");
        logout();
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bothUsersCreated, isSeed, logout, navigate]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authServices.registerByAdmin(
        newUser.email,
        newUser.password,
        newUser.roleName,
        token
      );
      
      if (newUser.roleName === "admin") {
        setUsersCreated(prev => ({ ...prev, admin: true }));
      } else {
        setUsersCreated(prev => ({ ...prev, user: true }));
      }
      
      setMessage({ type: "success", text: `Usuario ${newUser.roleName} creado exitosamente` });
      setNewUser({ email: "", password: "", roleName: "user" });
      setShowCreateUser(false);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error al crear usuario";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Dashboard para ADMINISTRADOR (no seed)
  if (isAdmin) {
    return (
      <div className="dashboard-container">
        {/* Marca de agua */}
        <img 
          src="/portada3.png" 
          alt="" 
          className="dashboard-watermark"
        />

        <div className="dashboard-admin-main">
          {/* Header de Bienvenida */}
          <div className="dashboard-admin-header">
            <h1 className="dashboard-admin-title">Dashboard de Administrador</h1>
            <p className="dashboard-admin-welcome">
              Bienvenido, <span className="dashboard-admin-email">{user?.email}</span>
            </p>
            <div className="dashboard-admin-role">
              <span className="dashboard-admin-role-badge">Tu rol: Administrador</span>
            </div>
          </div>

          {/* Cards de Gestión */}
          <div className="dashboard-admin-cards">
            {/* Card Gestión de Usuarios */}
            <div className="dashboard-admin-card">
              <div className="dashboard-admin-card-icon">
                <span style={{fontSize: '40px'}}>👥</span>
              </div>
              <h3 className="dashboard-admin-card-title">Gestión de Usuarios</h3>
              <p className="dashboard-admin-card-desc">Como administrador, puedes:</p>
              <ul className="dashboard-admin-card-list">
                <li>Crear nuevos usuarios</li>
                <li>Editar usuarios existentes</li>
                <li>Activar/desactivar usuarios</li>
                <li>Eliminar usuarios</li>
              </ul>
              
              <div className="dashboard-admin-card-buttons">
                <button 
                  className="dashboard-admin-btn dashboard-admin-btn-primary"
                  onClick={() => navigate("/users")}
                >
                  📋 Ver Todos los Usuarios
                </button>
                <button 
                  className="dashboard-admin-btn dashboard-admin-btn-secondary"
                  onClick={() => setShowCreateUser(true)}
                >
                  ➕ Crear Nuevo Usuario
                </button>
              </div>

              {showCreateUser && (
                <form className="dashboard-admin-form" onSubmit={handleCreateUser}>
                  <h4 className="dashboard-admin-form-title">Crear Usuario</h4>
                  <div className="dashboard-admin-form-group">
                    <input
                      type="email"
                      className="dashboard-input"
                      placeholder="Email del usuario"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="dashboard-admin-form-group">
                    <input
                      type="password"
                      className="dashboard-input"
                      placeholder="Contraseña"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="dashboard-admin-form-group">
                    <select
                      className="dashboard-input"
                      value={newUser.roleName}
                      onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })}
                    >
                      <option value="user">Usuario Normal</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  
                  {message.text && (
                    <p className={message.type === "error" ? "dashboard-error" : "dashboard-success"}>
                      {message.text}
                    </p>
                  )}

                  <div className="dashboard-admin-form-buttons">
                    <button 
                      type="button" 
                      className="dashboard-admin-btn dashboard-admin-btn-cancel"
                      onClick={() => setShowCreateUser(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="dashboard-admin-btn dashboard-admin-btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Creando..." : "Crear Usuario"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Card Gestión de Solicitudes */}
            <div className="dashboard-admin-card">
              <div className="dashboard-admin-card-icon">
                <span style={{fontSize: '40px'}}>🚗</span>
              </div>
              <h3 className="dashboard-admin-card-title">Gestión de Solicitudes</h3>
              <p className="dashboard-admin-card-desc">Administra las solicitudes de los aspirantes</p>
              
              <div className="dashboard-admin-card-buttons">
                <button 
                  className="dashboard-admin-btn dashboard-admin-btn-accent"
                  onClick={() => navigate("/applications")}
                >
                  🚗 Gestionar Solicitudes
                </button>
              </div>
            </div>
          </div>

          {/* Botón Cerrar Sesión */}
          <div className="dashboard-admin-logout">
            <button 
              className="dashboard-admin-btn dashboard-admin-btn-logout"
              onClick={() => logout()}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <img src="/pie_pagina.png" alt="pie de pagina" style={{maxWidth: '200px'}} />
        </footer>
      </div>
    );
  }

  // Dashboard para USUARIO SEMILLA (seed)
  if (isSeed) {
    return (
      <div className="dashboard-container">
        <img 
          src="/portada3.png" 
          alt="" 
          className="dashboard-watermark"
        />
        <div className="dashboard-admin-main">
          <div className="dashboard-admin-header">
            <h1 className="dashboard-admin-title">Dashboard</h1>
            <p className="dashboard-admin-welcome">
              Bienvenido, <span className="dashboard-admin-email">{user?.email}</span>
            </p>
            <div className="dashboard-admin-role">
              <span className="dashboard-admin-role-badge">Usuario Semilla</span>
            </div>
          </div>

          <div className="dashboard-admin-cards">
            {!bothUsersCreated ? (
              <div className="dashboard-admin-card">
                <h3 className="dashboard-admin-card-title">Crear Usuarios Iniciales</h3>
                <p className="dashboard-admin-card-desc">Como usuario semilla, puedes crear:</p>
                <ul className="dashboard-admin-card-list">
                  <li className={usersCreated.admin ? "completed" : ""}>
                    1 Usuario Administrador {usersCreated.admin ? "✓" : ""}
                  </li>
                  <li className={usersCreated.user ? "completed" : ""}>
                    1 Usuario Normal {usersCreated.user ? "✓" : ""}
                  </li>
                </ul>

                {!showCreateUser ? (
                  <button 
                    className="dashboard-admin-btn dashboard-admin-btn-primary"
                    onClick={() => setShowCreateUser(true)}
                  >
                    Crear Nuevo Usuario
                  </button>
                ) : (
                  <form className="dashboard-admin-form" onSubmit={handleCreateUser}>
                    <div className="dashboard-admin-form-group">
                      <input
                        type="email"
                        className="dashboard-input"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="dashboard-admin-form-group">
                      <input
                        type="password"
                        className="dashboard-input"
                        placeholder="Contraseña"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="dashboard-admin-form-group">
                      <select
                        className="dashboard-input"
                        value={newUser.roleName}
                        onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })}
                      >
                        <option value="user" disabled={usersCreated.user}>Usuario Normal</option>
                        <option value="admin" disabled={usersCreated.admin}>Administrador</option>
                      </select>
                    </div>
                    
                    {message.text && (
                      <p className={message.type === "error" ? "dashboard-error" : "dashboard-success"}>
                        {message.text}
                      </p>
                    )}

                    <div className="dashboard-admin-form-buttons">
                      <button 
                        type="button" 
                        className="dashboard-admin-btn dashboard-admin-btn-cancel"
                        onClick={() => setShowCreateUser(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="dashboard-admin-btn dashboard-admin-btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Creando..." : "Crear Usuario"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="dashboard-admin-card dashboard-success">
                <h3 className="dashboard-admin-card-title">✓ Completado</h3>
                <p className="dashboard-admin-card-desc">Has completado la creación de usuarios iniciales.</p>
                <p>Serás redirigido al login...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard para USUARIO NORMAL
  return (
    <div className="dashboard-container">
      <img 
        src="/portada3.png" 
        alt="" 
        className="dashboard-watermark"
      />
      <div className="dashboard-admin-main">
        <div className="dashboard-admin-header">
          <h1 className="dashboard-admin-title">Dashboard</h1>
          <p className="dashboard-admin-welcome">
            Bienvenido, <span className="dashboard-admin-email">{user?.email}</span>
          </p>
          <div className="dashboard-admin-role">
            <span className="dashboard-admin-role-badge">Usuario</span>
          </div>
        </div>

        <div className="dashboard-admin-cards">
          <div className="dashboard-admin-card">
            <h3 className="dashboard-admin-card-title">Gestión de Solicitudes</h3>
            <p className="dashboard-admin-card-desc">Administra las solicitudes de los aspirantes</p>
            
            <div className="dashboard-admin-card-buttons">
              <button 
                className="dashboard-admin-btn dashboard-admin-btn-accent"
                onClick={() => navigate("/applications")}
              >
                🚗 Gestionar Solicitudes
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-admin-logout">
          <button 
            className="dashboard-admin-btn dashboard-admin-btn-logout"
            onClick={() => logout()}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <footer className="dashboard-footer">
        <img src="/pie_pagina.png" alt="pie de pagina" style={{maxWidth: '200px'}} />
      </footer>
    </div>
  );
};

export default DashboardPage;
