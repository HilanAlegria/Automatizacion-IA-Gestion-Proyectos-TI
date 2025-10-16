// src/stores/authStore.js

import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user_data')) || null,
    loading: false, // El componente UserLogin.vue usará su propio estado 'isLoading'
    error: null, // Mantenemos el error para que el componente pueda leerlo
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user ? state.user.user_name : 'Invitado',
  },

  actions: {
    async login(username, password) {
      this.error = null; // Limpiamos errores internos
      
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          username,
          password
        });

        // 1. Procesar respuesta exitosa
        const { access_token, user_name, jira_instance } = response.data;
        
        this.token = access_token;
        this.user = { user_name, jira_instance };

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(this.user));

        return true; // Éxito
        
      } catch (err) {
        // 2. Manejo de error de FastAPI (ej. 401 Unauthorized)
        if (err.response && err.response.status === 401) {
             this.error = 'Credenciales no válidas.';
        } else {
             this.error = 'Error de red o servidor no disponible.';
        }
        this.logout(); 
        // Lanza un error para que el 'catch' en el componente lo maneje si es necesario
        // Pero en este caso, devolvemos false para que el componente lo sepa.
        return false; 
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
  }
});