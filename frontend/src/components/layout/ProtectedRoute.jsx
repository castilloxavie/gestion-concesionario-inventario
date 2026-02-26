import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false}) =>  {
    const {isAuthenticated, loading, user} = useAuth()

    if (loading) {
        return <div>Cargando...</div>
    }

    if(!isAuthenticated){
        return <Navigate to="/login" />
    }

    if(requireAdmin && user?.role !== "admin"){
        return <Navigate to="/dashboard" replace/>
    }

    return children
    
}

export default ProtectedRoute;