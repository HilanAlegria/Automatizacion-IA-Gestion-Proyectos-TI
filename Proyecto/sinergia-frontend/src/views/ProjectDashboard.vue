<template>
  <div class="dashboard">
    <h2>Bienvenido a SinergIA</h2>
    <p class="greeting">
      Hola, {{ authStore.userName }}. Usa esta plataforma para orquestar la gestión de tu proyecto TI con ayuda de la Inteligencia Artificial.
    </p>

    <div class="status-card">
      <h3>Estado del Proyecto</h3>
      <div v-if="projectStore.isProjectSelected">
        <p>✅ **Proyecto Seleccionado:** {{ projectStore.selectedProject.name }} ({{ projectStore.selectedProject.key }})</p>
        <p>Ahora puedes usar los asistentes de IA (**RAG Scrum** y **RAG XP**) en la barra lateral.</p>
      </div>
      <div v-else class="alert-warning">
        <p>🛑 **Atención:** No has seleccionado un proyecto de Jira.</p>
        <p>Por favor, selecciona un proyecto en la barra superior para habilitar todas las funciones de IA.</p>
      </div>
    </div>
    
    <div class="dashboard-metrics">
        </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';

const authStore = useAuthStore();
const projectStore = useProjectStore();
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.greeting {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 30px;
}

.status-card {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-left: 5px solid #1abc9c; /* Color de acento */
}

.status-card h3 {
    margin-top: 0;
    color: #2c3e50;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.alert-warning {
    color: #e67e22; /* Naranja */
    padding: 10px;
    background-color: #fef7ec;
    border-radius: 4px;
    border: 1px solid #f39c12;
}

.alert-warning p {
    margin: 5px 0;
}
</style>