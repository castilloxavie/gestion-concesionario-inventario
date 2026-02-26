import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authServices";
import "../../styles/auth.css";

const SetupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            await authServices.registerSeed(email, password);
            setSuccess("Usuario Administrador creado exitosamente");
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Error en el registro seed:", error);
            if (error.response?.status === 400) {
                setError("Ya existe un usuario en el sistema. Use /login");
            } else {
                setError("Error al crear el usuario administrador. Intente de nuevo.");
            }
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
                        src="/portada1.png" 
                        alt="Configuración" 
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
                        <h2 className="auth-form-title">CONFIGURACIÓN INICIAL</h2>
                        <p className="auth-form-subtitle">Crear el primer usuario Administrador del sistema</p>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label>
                                    Correo Electrónico (Admin)
                                </label>
                                <input
                                    type="email"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label>
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="auth-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label>
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="auth-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="auth-submit-btn"
                            >
                                CREAR ADMINISTRADOR
                            </button>
                        </form>

                        <p className="auth-link-text">
                            ¿Ya tiene cuenta?{" "}
                            <a href="/login" className="auth-link">
                                Iniciar Sesión
                            </a>
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

export default SetupPage;
