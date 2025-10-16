<template>
  <div class="reports-viewer">
    <h1>Generación Automatizada de Reportes</h1>
    <p>Utiliza la inteligencia artificial de SinergIA para generar documentos de trazabilidad (RTM) y reportes de calidad basados en el proyecto activo en Jira, alineados con estándares como ISO/IEC/IEEE 29148 y 29119.</p>

    <div v-if="!jiraProjectSelected" class="warning">
        ⚠️ Por favor, selecciona un proyecto de Jira en el panel superior para generar reportes.
    </div>

    <div v-else class="report-actions">
        <h2>Reportes Disponibles</h2>
        
        <div class="report-card">
            <h3>Matriz de Trazabilidad (RTM)</h3>
            <p>Genera la Matriz de Trazabilidad de Requisitos (RTM) completa, vinculando los requisitos del SRS a los issues de Jira y casos de prueba, verificando la cobertura (trazabilidad ≥ 95% es un criterio de éxito).</p>
            <button @click="generateReport('RTM')" :disabled="isLoadingReport === 'RTM'">
                {{ isLoadingReport === 'RTM' ? 'Generando RTM...' : 'Generar y Descargar RTM' }}
            </button>
        </div>

        <div class="report-card">
            <h3>Reporte de Calidad (ISO 25010)</h3>
            <p>Reporte que analiza las métricas del proyecto en Jira y las relaciona con los atributos de calidad (ISO/IEC 25010) para una evaluación académica.</p>
            <button @click="generateReport('Quality')" :disabled="isLoadingReport === 'Quality'">
                {{ isLoadingReport === 'Quality' ? 'Generando Reporte...' : 'Generar Reporte de Calidad' }}
            </button>
        </div>
    </div>
    
    <p v-if="statusMessage" :class="statusType">{{ statusMessage }}</p>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import apiService from '@/services/apiService';

const projectStore = useProjectStore();

const isLoadingReport = ref(null); // 'RTM', 'Quality', or null
const statusMessage = ref(null);
const statusType = ref(null);

const jiraProjectSelected = computed(() => projectStore.selectedProjectId);

async function generateReport(reportType) {
    if (!jiraProjectSelected.value) return;

    isLoadingReport.value = reportType;
    statusMessage.value = `Solicitando la generación del reporte ${reportType}... Esto puede tardar unos minutos.`;
    statusType.value = 'info';

    try {
        const endpoint = `/reports/${reportType.toLowerCase()}`;
        
        // La petición espera el ID del proyecto y potencialmente devuelve un archivo/URL
        const response = await apiService.post(endpoint, {
            project_id: jiraProjectSelected.value,
        }, {
            responseType: 'blob' // Importante para manejar la descarga de archivos (PDF/DOCX)
        });

        // Simular la descarga de un archivo (asumiendo que FastAPI devuelve un blob)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}_SinergIA_${jiraProjectSelected.value}_${Date.now()}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Limpieza

        statusMessage.value = `✅ Reporte ${reportType} generado y descargado exitosamente.`;
        statusType.value = 'success';

    } catch (error) {
        statusMessage.value = `❌ Error al generar el reporte ${reportType}. Revise la conexión con el servidor.`;
        statusType.value = 'error';
        console.error(`Fallo en la generación de ${reportType}:`, error);
    } finally {
        isLoadingReport.value = null;
    }
}
</script>

<style scoped>
.reports-viewer { max-width: 900px; margin: 0 auto; }
.report-actions { margin-top: 30px; }
.report-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: white;
}
.report-card button {
    background-color: #28a745;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}
.report-card button:disabled { background-color: #a0d8a0; cursor: not-allowed; }
.info { color: #004085; background-color: #cce5ff; padding: 10px; border-radius: 4px; }
.success { color: #155724; background-color: #d4edda; padding: 10px; border-radius: 4px; }
.error { color: #721c24; background-color: #f8d7da; padding: 10px; border-radius: 4px; }
.warning { /* Estilo del warning ya definido */ }
</style>