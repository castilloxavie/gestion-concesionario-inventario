import apliClient from "../api/apiClient";

const applicationServices = {
    // Obtener todas las aplicaciones
    getAllApplications: async (token = null) => {
        try {
            const response = await apliClient.get("/applications/");
            return response.data;
        } catch (error) {
            console.error("Error al obtener aplicaciones:", error);
            throw error;
        }
    },

    // Obtener una aplicación por ID
    getApplicationById: async (id, token = null) => {
        try {
            const response = await apliClient.get(`/applications/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener aplicación:", error);
            throw error;
        }
    },

    // Crear nueva aplicación
    createApplication: async (applicationData, token = null) => {
        try {
            const response = await apliClient.post("/applications/", applicationData);
            return response.data;
        } catch (error) {
            console.error("Error al crear aplicación:", error);
            throw error;
        }
    },

    // Actualizar aplicación
    updateApplication: async (id, applicationData, token = null) => {
        try {
            const response = await apliClient.patch(`/applications/${id}`, applicationData);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar aplicación:", error);
            throw error;
        }
    },

    // Eliminar aplicación
    deleteApplication: async (id, token = null) => {
        try {
            const response = await apliClient.delete(`/applications/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar aplicación:", error);
            throw error;
        }
    }
};

export default applicationServices;
