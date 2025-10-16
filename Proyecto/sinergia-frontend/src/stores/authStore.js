import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router'; 

// 🎯 URL base de tu API de FastAPI
const API_BASE_URL = 'http://localhost:8000/api'; 

export const useAuthStore = defineStore('auth', {
    // ----------------------------------------------------
    // ESTADO (State)
    // ----------------------------------------------------
    state: () => ({
        // Inicializa el estado leyendo desde localStorage
        token: localStorage.getItem('access_token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        error: null, // Para almacenar mensajes de error del API
    }),

    // ----------------------------------------------------
    // GETTERS
    // ----------------------------------------------------
    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    // ----------------------------------------------------
    // ACCIONES (Actions)
    // ----------------------------------------------------
    actions: {
        async login(username, password) {
            this.error = null; // Limpiar errores anteriores
            
            // 🚨 MOCK TEMPORAL PARA PRUEBAS DEL FRONTEND 🚨
            // Elimina este bloque cuando tu API de FastAPI esté lista
            if (username === 'test' && password === '1234') {
                console.log("MOCK: Login exitoso con credenciales de prueba ('test'/'1234').");
                
                // Simular token y usuario
                const accessToken = 'fake_mock_token_12345';
                this.token = accessToken;
                this.user = { 
                    username: username, 
                    role: 'Project Manager', 
                    email: `${username}@sinergia.com` 
                };

                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('user', JSON.stringify(this.user));

                return true; // Éxito simulado
            }
            // 🚨 FIN DEL MOCK TEMPORAL 🚨

            try {
                // 1. Preparar datos para el endpoint /auth/login de FastAPI
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);

                // 2. Llamada al API real
                const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                // 3. Procesa el token
                const accessToken = response.data.access_token;
                
                // 4. Establecer estado y persistir
                this.token = accessToken;
                // SIMULACIÓN DE DATOS DE USUARIO (Reemplazar con llamada a /users/me real)
                this.user = { 
                    username: username, 
                    role: 'Project Manager', 
                    email: `${username}@sinergia.com` 
                };

                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('user', JSON.stringify(this.user));

                return true; // Éxito
            } catch (error) {
                // Manejo de errores de autenticación (ej. 401 Unauthorized)
                if (error.response && error.response.status === 401) {
                    this.error = 'Credenciales inválidas. Verifique usuario y contraseña.';
                } else {
                    // Si el mock no se usó y falla la conexión
                    this.error = 'Error de conexión con el servidor FastAPI o error inesperado.';
                    console.error("Error de inicio de sesión:", error);
                }
                
                return false; // Fallo
            }
        },

        logout() {
            // 1. Limpiar estado y almacenamiento local
            this.token = null;
            this.user = null;
            this.error = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            
            // 2. Redirigir a la vista de login
            // 🚨 CORRECCIÓN: Usamos 'UserLogin' que es el nombre de la ruta en tu index.js
            router.push({ name: 'UserLogin' }); 
        },
        
        getAuthHeader() {
            return this.token ? `Bearer ${this.token}` : '';
        }
    }
});