<template>
  <div class="project-selector-container">
    <label for="jira-project-select" class="selector-label">Proyecto Activo:</label>
    
    <select 
      id="jira-project-select" 
      :value="projectStore.selectedProjectId"
      @change="handleChange"
      :disabled="projectStore.loading"
      class="project-select"
      aria-label="Selector de Proyecto de Jira"
    >
      <option value="" disabled selected>
        {{ projectStore.loading ? 'Cargando...' : '-- Seleccione un proyecto --' }}
      </option>
      
      <option 
        v-for="project in projectStore.projects" 
        :key="project.key" 
        :value="project.key"
      >
        {{ project.name }} ({{ project.key }})
      </option>
    </select>

    <span v-if="projectStore.error" class="error-message" title="Error al cargar proyectos">
        ⚠️ Error de Conexión
    </span>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore';
import { onMounted } from 'vue';

const projectStore = useProjectStore();

onMounted(() => {
  // Cargar proyectos tan pronto como el componente se monte
  projectStore.fetchProjects(); 
});

/**
 * Maneja el cambio en el selector y actualiza el store con el proyecto seleccionado.
 * @param {Event} event - El evento de cambio del selector.
 */
function handleChange(event) {
  const selectedKey = event.target.value;
  // Llamamos a la acción del store que busca y establece el proyecto por su clave
  projectStore.selectProjectByKey(selectedKey);
}
</script>

<style scoped>
.project-selector-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.selector-label {
    font-weight: 500;
    color: #555;
    font-size: 0.95rem;
}

.project-select {
    padding: 8px 15px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.3s;
    min-width: 200px;
}

.project-select:hover {
    border-color: #3498db;
}

.project-select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-left: 5px;
}
</style>