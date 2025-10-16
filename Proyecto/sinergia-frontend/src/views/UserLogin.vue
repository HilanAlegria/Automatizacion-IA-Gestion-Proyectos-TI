// src/views/UserLogin.vue
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <img src="@/assets/sinergia-logo.png" alt="SinergIA Logo" class="logo">
      <h2>SinergIA Login</h2>
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" required :disabled="isLoading">
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required :disabled="isLoading">
      </div>
      
      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Conectando...' : 'Iniciar Sesión' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Necesario para la redirección
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('mock_user'); // Valores iniciales para la prueba
const password = ref('mock_pass'); // Valores iniciales para la prueba
const isLoading = ref(false);
const error = ref(null);

async function handleLogin() {
  isLoading.value = true;
  error.value = null;

  try {
    // 1. Llamar a la acción de login en el store
    const success = await authStore.login(username.value, password.value);
    
    // 2. Si es exitoso, redirigimos manualmente
    if (success) {
      router.push({ name: 'Dashboard' });
    } else {
      // Si el store devuelve false (falla la autenticación)
      error.value = authStore.error || 'Credenciales inválidas. Inténtelo de nuevo.';
    }

  } catch (err) {
    // 3. Manejo de errores de conexión/servidor
    error.value = 'Error de conexión con el servidor. ¿Está FastAPI corriendo?';
    console.error('Fallo grave en el login:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #eef2f7; /* Color de fondo más suave */
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* Sombra más profunda */
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #a0c9ff;
  cursor: not-allowed;
}

.error-message {
  color: #d9534f; /* Color de error de Bootstrap */
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 0.9rem;
  text-align: left;
}
</style>