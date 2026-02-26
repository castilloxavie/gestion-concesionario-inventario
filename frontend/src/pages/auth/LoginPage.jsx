import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authServices from "../../services/authServices";


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const  token = await authServices.login(email, password)
            login(token, { email })
            navigate("/dashboard")

        } catch (error) {
            console.log("Falla el inicio de Sesion: ", error)
            setError("Credenciales Incorrectas. Por favor Intente de Nuevo")
        }
    }

    return (
    <form onSubmit={handleSubmit}>
        <h2>Inicio de Sesiom</h2>

        <label htmlFor="email">Correo Electronico</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Inicio</button>
    </form>
)
    
}

export default LoginPage;