import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authServices from "../../services/authServices";
import "../../styles/auth.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = await authServices.login(email, password);
            const perfil = await authServices.getProfile(token);
            login(token, { email: perfil.email, role: perfil.role, is_seed: perfil.is_seed });
            navigate("/dashboard");
        } catch (error) {
            console.log("Falla el inicio de Sesion: ", error);
            setError("Credenciales Incorrectas. Por favor Intente de Nuevo");
        }
    };

    return (
        <div className="auth-container">
            {/* Marca de agua */}
            <img 
                src="/portada3.png" 
                alt="" 
                className="auth-watermark"
            />

            {/* Header */}
            <header className="auth-header">
                <img 
                    src="/portada1.png" 
                    alt="Logo" 
                    className="auth-logo"
                />
            </header>

            {/* Main Content */}
            <main className="auth-main">
                {/* Lado izquierdo - Ilustración */}
                <div className="auth-left">
                    <img 
                        src="/portada2.png" 
                        alt="Bienvenido" 
                        className="auth-illustration"
                    />
                    <div className="auth-welcome-text">
                        <h1>BIENVENIDO A</h1>
                        <h2>MONITORING INNOVATION</h2>
                    </div>
                </div>

                {/* Lado derecho - Formulario */}
                <div className="auth-right">
                    <div className="auth-form-card">
                        <h2 className="auth-form-title">INICIO DE SESIÓN</h2>
                        <p className="auth-form-subtitle">Gestión de Concesionario</p>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="auth-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="--------"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="auth-submit-btn"
                            >
                                INGRESAR
                            </button>
                        </form>

                        <p className="auth-link-text">
                            ¿No tiene cuenta?{" "}
                            <Link to="/register" className="auth-link">
                                Registrarse
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="auth-footer">
                <div className="auth-footer-links">
                    <a href="#">MONITORINGINNOVATION</a>
                    <a href="#">GPS CONTROL</a>
                </div>
                
                {/* Botones de repositorio GitHub */}
                <div className="auth-repo-buttons">
                    <a 
                        href="https://github.com/castilloxavie/gestion-concesionario-inventario/tree/main/backend" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="repo-btn repo-btn-backend"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        Backend
                    </a>
                    <a 
                        href="https://github.com/castilloxavie/gestion-concesionario-inventario/tree/main/frontend" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="repo-btn repo-btn-frontend"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        Frontend
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
