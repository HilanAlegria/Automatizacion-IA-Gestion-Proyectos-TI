<template>
  <div id="sinergia-layout" class="app-layout">
    
    <header class="top-bar">
      <h1 class="app-title">SinergIA Dashboard</h1>
      
      <div class="header-controls">
        <JiraProjectSelector class="jira-selector" /> 
        
        <button @click="handleLogout" class="logout-button">
          Cerrar Sesión ({{ authStore.userName }})
        </button>
      </div>
    </header>
    
    <div class="content-wrapper">
      <SidebarNav />
      
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// Nota: La importación de SidebarNav y JiraProjectSelector ya está correcta
import SidebarNav from './SidebarNav.vue';
import JiraProjectSelector from './JiraProjectSelector.vue';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Función para manejar el cierre de sesión (Esta lógica es correcta)
function handleLogout() {
    authStore.logout();
    router.push({ name: 'UserLogin' }); 
}
</script>

<style scoped>
/*
  Reestructuración clave de CSS:
  1. app-layout: Contenedor principal (display: flex column)
  2. top-bar: Header fijo
  3. content-wrapper: Contenedor para Sidebar y Main Content (display: flex row)
*/

.app-layout {
    display: flex; /* La clave para que el header y el wrapper se apilen */
    flex-direction: column;
    height: 100vh;
}

.top-bar {
    height: 60px;
    padding: 0 20px;
    background-color: white;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Alinea logo/título a la izquierda y controles a la derecha */
}

.app-title {
    font-size: 1.2rem;
    color: #333;
    margin: 0;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 20px; /* Espacio entre el selector de Jira y el botón de logout */
}

.content-wrapper {
    flex-grow: 1; /* Ocupa el espacio restante bajo el header */
    display: flex; /* La CLAVE para poner Sidebar y Main Content uno al lado del otro */
    overflow: hidden; /* Evita que el scroll afecte a todo el layout */
}

/* Nota: La clase 'SidebarNav' debe tener su width definido en su propio componente */

.page-content {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto; /* Permite desplazamiento solo en el contenido de la página */
    background-color: #f4f4f9;
}

/* Mantenemos los estilos de logout, pero cambiamos el selector si es necesario */
.logout-button {
    padding: 8px 15px;
    background-color: #dc3545; 
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.logout-button:hover {
    background-color: #c82333;
}
</style>