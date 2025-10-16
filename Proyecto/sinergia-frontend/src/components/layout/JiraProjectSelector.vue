<template>
  <div class="jira-selector">
    <span class="status-label">Conexión Jira:</span>
    <span :class="['status-indicator', projectStore.jiraConnectionStatus]">
      {{ displayStatus }}
    </span>

    <select 
      v-if="projectStore.availableProjects.length > 0 && projectStore.jiraConnectionStatus === 'connected'"
      :value="projectStore.selectedProjectId" 
      @change="handleProjectChange"
      class="project-select"
    >
      <option disabled value="">Seleccionar Proyecto</option>
      <option v-for="project in projectStore.availableProjects" :key="project.id" :value="project.id">
        [{{ project.key }}] {{ project.name }}
      </option>
    </select>
    <span v-else-if="projectStore.jiraConnectionStatus === 'connected'">
      (No hay proyectos disponibles)
    </span>
    
    <button @click="projectStore.fetchAvailableProjects" 
            :disabled="projectStore.jiraConnectionStatus === 'connecting'"
            class="refresh-button">
      Recargar
    </button>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore';
import { computed, onMounted } from 'vue';

const projectStore = useProjectStore();

// Obtener los proyectos al montar el componente (si aún no se ha hecho, aunque el Dashboard lo llama)
onMounted(() => {
  if (projectStore.availableProjects.length === 0) {
      projectStore.fetchAvailableProjects();
  }
});

function handleProjectChange(event) {
  const projectId = event.target.value;
  projectStore.setSelectedProject(projectId);
  // Opcional: Notificar al usuario o recargar el dashboard.
}

const displayStatus = computed(() => {
    switch(projectStore.jiraConnectionStatus) {
        case 'connected': return 'OK';
        case 'connecting': return 'Cargando...';
        case 'error': return 'Fallo';
        default: return 'No conectado';
    }
});
</script>

<style scoped>
.jira-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
}

.status-indicator {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.status-indicator.connected { background-color: #d4edda; color: #155724; }
.status-indicator.connecting { background-color: #fff3cd; color: #856404; }
.status-indicator.error { background-color: #f8d7da; color: #721c24; }

.project-select, .refresh-button {
    padding: 5px 10px;
    border-radius: 4px;
}

.refresh-button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}
</style>