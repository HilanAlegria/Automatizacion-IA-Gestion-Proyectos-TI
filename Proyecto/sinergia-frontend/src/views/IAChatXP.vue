<template>
  <div class="ia-chat-container">
    <h2>Asistente RAG para Metodología XP (Extreme Programming)</h2>
    <p v-if="!jiraProjectSelected" class="warning">
        ⚠️ Por favor, selecciona un proyecto de Jira en el panel superior para activar el asistente.
    </p>

    <div class="chat-history" :class="{ 'disabled-chat': !jiraProjectSelected }">
      <div v-for="message in xpHistory" :key="message.id" 
           :class="['chat-bubble', { 'user-message': message.sender === 'user', 'ai-message': message.sender === 'ai' }]">
        <p v-html="formatMessage(message.text)"></p>
      </div>
      
      <div v-if="isAILoading" class="ai-loading">
        SinergIA está pensando...
      </div>
    </div>

    <div class="chat-input-area">
      <input 
        v-model="currentQuery"
        @keyup.enter="sendQuery"
        :disabled="isAILoading || !jiraProjectSelected"
        placeholder="Consulta sobre XP, tareas del proyecto, o mejores prácticas..."
      />
      <button @click="sendQuery" :disabled="isAILoading || !currentQuery.trim() || !jiraProjectSelected">
        Enviar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useProjectStore } from '@/stores/projectStore';
import apiService from '@/services/apiService'; 

const chatStore = useChatStore();
const projectStore = useProjectStore();
const currentQuery = ref('');

// Propiedades computadas
const isAILoading = computed(() => chatStore.isAILoading);
const jiraProjectSelected = computed(() => projectStore.selectedProjectId);

// Filtra el historial para mostrar solo la conversación de XP
const xpHistory = computed(() => 
    chatStore.conversationHistory.filter(msg => msg.context === 'xp')
);

// Función de envío adaptada al endpoint de XP
async function sendQuery() {
    if (!currentQuery.value.trim() || isAILoading.value || !jiraProjectSelected.value) return;

    const queryText = currentQuery.value;
    
    // Usamos el contexto 'xp'
    chatStore.addMessage('user', queryText, 'xp'); 
    chatStore.setLoading(true);
    currentQuery.value = '';

    try {
        // CAMBIO CRÍTICO: Llamada al endpoint de FastAPI para el RAG de XP
        const response = await apiService.post('/rag/query/xp', {
            project_id: jiraProjectSelected.value, 
            query: queryText
        });

        chatStore.addMessage('ai', response.data.answer || 'No se pudo generar una respuesta.', 'xp'); 

    } catch (error) {
        let errorMessage = 'Error de conexión con el servidor.';
        if (error.response) {
            errorMessage = `Error del servidor (${error.response.status}): Fallo al procesar la consulta XP.`;
        }
        console.error('Error en la consulta RAG XP:', error);
        chatStore.addMessage('system', errorMessage, 'xp');
        
    } finally {
        chatStore.setLoading(false);
    }
}

function formatMessage(text) {
    // Lógica de formato, igual que en el componente Scrum
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
}
</script>

<style scoped>
/* Copia los estilos del IAChatScrum.vue, o usa estilos globales */
.ia-chat-container { /* ... */ }
.chat-history { /* ... */ }
.disabled-chat {
    /* Estilos para indicar que el chat está deshabilitado sin proyecto */
    opacity: 0.7;
    pointer-events: none;
}
.warning {
    padding: 10px;
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
    border-radius: 4px;
}
</style>