<template>
  <nav class="sidebar">
    <div class="logo">SinergIA</div>
    <router-link to="/" class="nav-item">
      <i class="icon-dashboard"></i> Dashboard
    </router-link>

    <h3>Asistentes IA</h3>
    <router-link to="/ia/scrum" class="nav-item" :class="{ 'disabled': !isProjectSelected }">
      <i class="icon-scrum"></i> RAG Scrum
    </router-link>
    <router-link to="/ia/xp" class="nav-item" :class="{ 'disabled': !isProjectSelected }">
      <i class="icon-xp"></i> RAG XP
    </router-link>

    <h3>Reportes</h3>
    <router-link to="/reports" class="nav-item">
      <i class="icon-reports"></i> Generar Reportes
    </router-link>

    <div class="footer-actions">
      <a @click="authStore.logout()" class="nav-item logout">
        <i class="icon-logout"></i> Cerrar Sesión
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { computed } from 'vue';

const authStore = useAuthStore();
const projectStore = useProjectStore();

const isProjectSelected = computed(() => projectStore.isProjectSelected);
</script>

<style scoped>
.sidebar {
    width: 200px;
    height: 100vh; /* CLAVE: Ocupa toda la altura vertical */
    background-color: #2c3e50; /* Color oscuro para el sidebar */
    color: white;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0; /* Asegura que el sidebar no se encoja */
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
}

h3 {
    font-size: 0.9rem;
    color: #95a5a6;
    margin: 15px 20px 5px;
    text-transform: uppercase;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    text-decoration: none;
    color: white;
    transition: background-color 0.3s;
}

.nav-item:hover {
    background-color: #34495e;
}

/* NOTA: El selector de enlace activo debe ser .router-link-exact-active si usas Vue Router 4 */
.router-link-active {
    background-color: #3498db; /* Color de acento para la página activa */
}

.nav-item.disabled {
    opacity: 0.5;
    /*pointer-events: none;*/ /* Deshabilita el click */
}

.footer-actions {
    margin-top: auto; /* Empuja el botón de logout al final */
}

.logout {
    color: #e74c3c; /* Color de peligro para logout */
    cursor: pointer;
}
/* Estilos para íconos son placeholder, se usaría Font Awesome o similar */
.icon-dashboard, .icon-scrum, .icon-xp, .icon-reports, .icon-logout {
    margin-right: 10px;
}
</style>