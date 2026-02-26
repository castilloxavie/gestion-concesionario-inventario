import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SetupPage from "../pages/auth/SetupPage";


const DashboardPage =  () => <h1>Pagina de Dashboard</h1>
const UserSPages = () => <h1>Pagina de  Usuarios</h1>
const NotFoundPage = () => <h1>Pagina no encontrada</h1>

export const AppRouter = () => {
    return (
        <Routes>
            {/*Ruta de autenticazion*/}
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />


            {/*Rutas principales*/}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UserSPages />} />

            {/* Ruta no encontrada*/}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}
