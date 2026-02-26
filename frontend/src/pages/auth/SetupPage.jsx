import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authServices";

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
            setSuccess("Usuario Admin creado exitosamente");
            
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
        <div>
            <h2>Configuración Inicial</h2>
            <p>Crear el primer usuario Administrador del sistema</p>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>Correo Electrónico (Admin)</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>Confirmar Contraseña</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Crear Administrador</button>
            </form>
        </div>
    );
};

export default SetupPage;
