import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authServices from "../../services/authServices";

const RegisterPage = () =>  {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (password !== confirmPassword){
            setError("Las contraseñas no coinciden")
            return
        }

        try {
            
            await authServices.register(email, password)
            setSuccess("Registro Exitoso")
            setTimeout(() => {
                navigate("/login")
            }, 2000)

        } catch (error) {
            setError("Error al Registrarse. Intente de Nuevo")
        }
    }
    

    return(
        <div>
            <h2>Registro de Usuario</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>Correo Electrónico</label>
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

                <button type="submit">Registrarse</button>
            </form>
            
            <p>¿Ya tiene cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
    )

}

export default RegisterPage;