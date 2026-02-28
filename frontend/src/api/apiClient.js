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

// Interceptor para FORZAR HTTPS en todas las URLs
apliClient.interceptors.request.use(
    (config) => {
        // FUERZA HTTPS en la URL completa
        if (config.url && config.url.startsWith('http://')) {
            config.url = config.url.replace('http://', 'https://');
        }
        
        // También forzamos la URL base si fuera necesario
        if (config.baseURL && config.baseURL.startsWith('http://')) {
            config.baseURL = config.baseURL.replace('http://', 'https://');
        }
        
        // Agregar el token automáticamente
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('📤 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
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
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default apliClient;
