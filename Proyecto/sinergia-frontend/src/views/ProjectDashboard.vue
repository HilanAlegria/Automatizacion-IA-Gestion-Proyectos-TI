<template>
  <div>
    <h1>Dashboard del Proyecto SinergIA</h1>
    <p>Bienvenido/a. Usa el selector para vincular un proyecto de Jira y activar los asistentes IA y la generación de reportes.</p>

    <div :class="['connection-status', projectStore.jiraConnectionStatus]">
        Estado de Conexión Jira: {{ displayStatus }}
    </div>

    <div v-if="projectStore.availableProjects.length && projectStore.jiraConnectionStatus === 'connected'">
        <label for="project-select" class="select-label">Proyecto Activo:</label>
        <select id="project-select" :value="projectStore.selectedProjectId" @change="handleProjectChange" class="project-select-dashboard">
            <option disabled value="">Seleccione un proyecto</option>
            <option v-for="project in projectStore.availableProjects" :key="project.id" :value="project.id">
                [{{ project.key }}] {{ project.name }}
            </option>
        </select>
    </div>
    
    <div v-if="!projectStore.isProjectSelected" class="warning-alert">
        Selecciona un proyecto Jira para visualizar las métricas y habilitar los asistentes IA.
    </div>

    <div v-if="projectStore.projectMetrics && projectStore.isProjectSelected" class="metrics-grid">
        <h2>Métricas Clave del Proyecto (Calculadas por IA)</h2>
        
        <MetricCard 
            title="SPI (Cronograma)" 
            :value="projectStore.projectMetrics.spi" 
            unit="Índice" 
            description="SPI > 1.0 es bueno. Indica la eficiencia del tiempo."
        />
        
        <MetricCard 
            title="CPI (Costo)" 
            :value="projectStore.projectMetrics.cpi" 
            unit="Índice" 
            description="CPI > 1.0 es bueno. Indica la eficiencia del presupuesto."
        />
        
        <MetricCard 
            title="Trazabilidad RTM" 
            :value="projectStore.projectMetrics.rtmCoverage" 
            :threshold="95"
            unit="%" 
            description="Cobertura de requisitos del SRS. Criterio de éxito: ≥ 95%."
        />

        <MetricCard 
            title="Cycle Time Promedio" 
            :value="projectStore.projectMetrics.cycleTimeDays" 
            :threshold="7"
            unit="Días" 
            description="Tiempo promedio para completar una tarea. Menor es mejor."
        />

    </div>
    <div v-else-if="projectStore.isProjectSelected && !projectStore.projectMetrics" class="loading-alert">
        Cargando métricas del proyecto...
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import MetricCard from '@/components/ui/MetricCard.vue'; // ¡Importante!

const projectStore = useProjectStore();

onMounted(() => {
    projectStore.fetchAvailableProjects();
    if (projectStore.isProjectSelected) {
        projectStore.fetchProjectMetrics();
    }
});

function handleProjectChange(event) {
    const projectId = event.target.value;
    projectStore.setSelectedProject(projectId);
    projectStore.fetchProjectMetrics(); 
}

const displayStatus = computed(() => {
    switch(projectStore.jiraConnectionStatus) {
        case 'connected': return 'Conectado';
        case 'connecting': return 'Conectando...';
        case 'error': return 'Error de conexión';
        default: return 'Desconectado';
    }
});
</script>

<style scoped>
/* Estilos adicionales para el dashboard */
.connection-status { padding: 10px; margin-bottom: 20px; border-radius: 4px; font-weight: bold; }
.connection-status.connected { background-color: #d4edda; color: #155724; }
.connection-status.connecting { background-color: #fff3cd; color: #856404; }
.connection-status.error { background-color: #f8d7da; color: #721c24; }

.select-label {
    font-weight: bold;
    margin-right: 10px;
}
.project-select-dashboard {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.warning-alert, .loading-alert {
    padding: 15px;
    margin-top: 20px;
    border-radius: 4px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.loading-alert {
    background-color: #e2e3e5;
    color: #383d41;
    border-color: #d6d8db;
}
</style>
