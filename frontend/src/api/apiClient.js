import axios from "axios"

// OBTENER la URL de la variable de entorno de Vite
// Esto se evalúa en TIEMPO DE BUILD, no en runtime
let envUrl = "";

// Try to get from Vite env var, fallback to empty string
try {
    envUrl = import.meta.env.VITE_API_BASE_URL || "";
} catch(e) {
    envUrl = "";
}

// Si hay una URL de entorno, usarla pero forzando HTTPS
// Si no, detectar automáticamente el entorno
let baseURL;

if (envUrl && envUrl.trim() !== "") {
    // Usar la variable de entorno pero forzando HTTPS
    baseURL = envUrl.trim();
    if (baseURL.startsWith('http://')) {
        baseURL = baseURL.replace('http://', 'https://');
    }
    // Asegurar que no tenga trailing slash para evitar doble //
    if (baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1);
    }
    console.log('🌐 Usando variable de entorno: ' + baseURL);
} else {
    // Fallback: detectar automáticamente
    const isProduction = window.location.hostname.includes('vercel.app');
    baseURL = isProduction 
        ? "https://gestion-concesionario-inventario-production.up.railway.app" 
        : "http://localhost:8000";
    console.log('🌐 Entorno detectado:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
}

console.log('🔗 URL Base:', baseURL);

const apliClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    }
})

// Interceptor para forzar HTTPS en cada request
apliClient.interceptors.request.use(
    (config) => {
        // FUERZA HTTPS absolute
        const fullUrl = config.baseURL + (config.url || '');
        if (fullUrl.startsWith('http://')) {
            config.url = fullUrl.replace('http://', 'https://');
        }
        
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('📤 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
        return config;
    },
    (error) => Promise.reject(error)
)

// Manejo de errores
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
