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
                    <a href="https://github.com/tu-repo-frontend" target="_blank" rel="noopener noreferrer">Link repo front</a>
                    <a href="https://github.com/tu-repo-backend" target="_blank" rel="noopener noreferrer">Link repo back</a>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
