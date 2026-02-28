import apliClient from "../api/apiClient";

const authServices = {

    login: async (email, password) => {
        try {
            
            const formData = new  URLSearchParams()
            formData.append("username", email)
            formData.append("password", password)

            const response = await apliClient.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }

            })

            return response.data.access_token

        } catch (error) {
            console.log("error en el servicio de Login", error.response?.data || error.message);
            throw error;
        }
    },

    getProfile: async (token) => {
        try {
            const response = await apliClient.get("/users/me", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data
        } catch (error) {
            console.log("Error al obtener perfil", error.response?.data || error.message);
            throw error;
        }
    },

    register: async(email, password) => {
        try {
            const response = await apliClient.post("/auth/register", {
                email: email,
                password: password
            })
            return response.data

        } catch (error) {
            console.error("Error en el servicio de registro", error.response?.data || error.message)
            throw error
        }
    },

    registerSeed: async(email, password) => {
        try {
            const response = await apliClient.post("/auth/register-seed", {
                email: email,
                password: password
            })
            return response.data

        } catch (error) {
            console.error("Error en el servicio de registro Sedd", error.response?.data || error.message)
            throw error
        }
    },

    // Registrar usuario por admin/seed (requiere token)
    registerByAdmin: async(email, password, roleName, token) => {
        try {
            const response = await apliClient.post("/auth/register-by-admin", {
                email: email,
                password: password,
                role_name: roleName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data

        } catch (error) {
            console.error("Error en el servicio de registro por admin", error.response?.data || error.message)
            throw error
        }
    },

    // Obtener todos los usuarios (solo admins)
    getAllUsers: async (token) => {
        try {
            const response = await apliClient.get("/users/", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data
        } catch (error) {
            console.log("Error al obtener usuarios", error.response?.data || error.message);
            throw error;
        }
    },

    // Actualizar usuario (solo admins)
    updateUser: async (userId, data, token) => {
        try {
            const response = await apliClient.patch(`/users/${userId}`, data, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data
        } catch (error) {
            console.log("Error al actualizar usuario", error.response?.data || error.message);
            throw error;
        }
    },

    // Eliminar usuario (solo admins)
    deleteUser: async (userId, token) => {
        try {
            const response = await apliClient.delete(`/users/${userId}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            return response.data
        } catch (error) {
            console.log("Error al eliminar usuario", error.response?.data || error.message);
            throw error;
        }
    }
}

export default authServices;
