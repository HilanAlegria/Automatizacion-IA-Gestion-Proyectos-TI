// src/services/apiService.js

import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; 

const API_BASE_URL = 'http://localhost:8000/api/v1'; 

const apiService = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Peticiones: Añadir el token Bearer
apiService.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.userToken; 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuestas: Manejo de error 401 (No autorizado/Token expirado)
apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout(); 
            // NOTA: La redirección debe manejarse en el componente o el router, 
            // pero el logout en el store es esencial.
            console.error('Sesión expirada o no autorizada. Token inválido.');
        }
        return Promise.reject(error);
    }
);

export default apiService;