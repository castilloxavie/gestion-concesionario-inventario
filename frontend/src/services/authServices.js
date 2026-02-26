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
    }
}

export default authServices;