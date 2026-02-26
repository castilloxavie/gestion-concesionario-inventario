import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SetupPage from "../pages/auth/SetupPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsersPage from "../pages/users/UsersPage";
import ApplicationsPage from "../pages/applications/ApplicationsPage";
import ProtectedRoute from "../components/layout/ProtectedRoute";


const NotFoundPage = () => <h1>Pagina no encontrada</h1>

export const AppRouter = () => {
    return (
        <Routes>
            {/*Ruta de autenticazion*/}
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />


            {/*Rutas principales - PROTEGIDAS*/}
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/users" element={
                <ProtectedRoute>
                    <UsersPage />
                </ProtectedRoute>
            } />
            <Route path="/applications" element={
                <ProtectedRoute>
                    <ApplicationsPage />
                </ProtectedRoute>
            } />

            {/* Ruta no encontrada*/}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}
