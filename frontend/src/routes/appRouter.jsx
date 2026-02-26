import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";


const DashboardPage =  () => <h1>Pagina de Dashboard</h1>
const UserSPages = () => <h1>Pagina de  Usuarios</h1>
const NotFoundPage = () => <h1>Pagina no encontrada</h1>

export const AppRouter = () => {
    return (
        <Routes>
            {/*Ruta de autenticazion*/}
            <Route path="/login" element={<LoginPage />} />

            {/*Rutas principales*/}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UserSPages />} />
            <Route path="/dashboard" element={<DashboardPage />} />
             <Route path="users" element={<UserSPages />} />

            {/* Ruta no encontrada*/}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}