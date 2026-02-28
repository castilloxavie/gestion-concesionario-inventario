import axios from "axios"

// URL base - HARDCODED para evitar problemas de variables de entorno
// Detectar si estamos en producción (Vercel) o desarrollo local
const isProduction = window.location.hostname.includes('vercel.app');

// En producción: usar Railway con HTTPS
// En desarrollo: usar localhost
const baseURL = isProduction 
    ? "https://gestion-concesionario-inventario-production.up.railway.app/" 
    : "http://localhost:8000/";

console.log('🌐 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('🔗 URL Base:', baseURL);

const apliClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    }
})

// Interceptor para agregar el token automáticamente a todas las solicitudes
apliClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Interceptor para manejar respuestas de error
apliClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default apliClient;
