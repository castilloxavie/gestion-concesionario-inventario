import axios from "axios"

// URL base - FORZAMOS HTTPS SIEMPRE en producción
let baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/"

// Asegurar que la URL termine con /
if (!baseURL.endsWith('/')) {
    baseURL += '/'
}

// FUERZA HTTPS en producción (detectar por el hostname de Vercel)
const isProduction = window.location.hostname.includes('vercel.app');
if (isProduction) {
    // Reemplazar http:// por https:// si existe
    if (baseURL.startsWith('http://')) {
        baseURL = baseURL.replace('http://', 'https://');
    }
    // Si no tiene protocolo, agregar https://
    if (!baseURL.startsWith('https://')) {
        baseURL = 'https://' + baseURL;
    }
    console.log('🔧 Modo producción detectado, URL base:', baseURL);
}

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
