<template>
  <div class="assistant-view">
    <h2>Asistente IA: RAG Scrum</h2>
    <p class="description">Pregunta al asistente sobre tu proyecto actual, basándose en la metodología Scrum y las mejores prácticas de gestión de TI.</p>
    
    <div v-if="!projectStore.isProjectSelected" class="alert-warning">
        <p>⚠️ **Atención:** Esta función está deshabilitada. Selecciona un proyecto de Jira en la barra superior para habilitar el asistente RAG Scrum.</p>
    </div>

    <div v-else class="chat-container">
        <header class="chat-header">
            Proyecto Activo: **{{ projectStore.selectedProject.name }}** ({{ projectStore.selectedProject.key }})
        </header>

        <div class="chat-history" ref="chatHistory">
            <div class="message system-message">
                <p>¡Hola! Soy tu Asistente RAG Scrum. Pregúntame sobre el estado de tu proyecto, riesgos, o cumplimiento de estándares (ISO/IEEE). **Ejemplo:** *¿Cuáles son los riesgos de mi Sprint actual?*</p>
            </div>

            <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender + '-message']">
                <div class="message-bubble">
                    <p>{{ message.text }}</p>
                    
                    <SourcesDisplay v-if="message.sender === 'ai' && message.sources.length" :sources="message.sources" />
                </div>
                <span class="message-time">{{ message.time }}</span>
            </div>
            
            <div v-if="isLoading" class="message system-message loading-message">
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
                <p>La IA está analizando los documentos y datos de Jira...</p>
            </div>
        </div>

        <div class="chat-input-area">
            <input
                type="text"
                v-model="userQuery"
                @keyup.enter="sendMessage"
                placeholder="Escribe tu pregunta sobre la gestión de tu proyecto Scrum..."
                :disabled="isLoading"
            />
            <button @click="sendMessage" :disabled="isLoading || !userQuery.trim()">
                <i class="icon-send"></i> Enviar
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios'; // ⬅️ Importar axios
import { useProjectStore } from '@/stores/projectStore';
import SourcesDisplay from '@/components/ia/SourcesDisplay.vue'; 

// 🎯 URL base de tu API de FastAPI (Asegúrate de que coincida con tu puerto)
const API_BASE_URL = 'http://localhost:8000/api'; 

const projectStore = useProjectStore();

// Estado del Chat
const userQuery = ref('');
const messages = ref([]);
const isLoading = ref(false);
const chatHistory = ref(null); 

// Función para asegurar que el chat siempre muestre el último mensaje
const scrollToBottom = () => {
    if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
    }
};

// ----------------------------------------------------
// 🚀 FUNCIÓN ACTUALIZADA: LLAMADA REAL A FASTAPI
// ----------------------------------------------------
const sendMessage = async () => {
    // ⚠️ Deshabilitar si no hay proyecto seleccionado
    if (!userQuery.value.trim() || isLoading.value || !projectStore.isProjectSelected) return;

    const queryText = userQuery.value.trim();
    const currentTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    // 1. Agregar mensaje del usuario
    messages.value.push({
        sender: 'user',
        text: queryText,
        time: currentTime
    });

    userQuery.value = '';
    isLoading.value = true;
    await nextTick(scrollToBottom);

    try {
        // Obtener el token de autenticación (asumiendo que está en localStorage)
        const token = localStorage.getItem('access_token');
        
        // Estructura de la solicitud (debe coincidir con el modelo ChatRequest de Pydantic)
        const payload = {
            project_key: projectStore.selectedProject.key, // Usar .key del proyecto
            query: queryText,
            // Opcional: Filtra y mapea el historial de chat para mantener el contexto
            history: messages.value.filter(m => m.sender !== 'system').map(m => ({
                sender: m.sender,
                text: m.text
            })) 
        };

        const response = await axios.post(`${API_BASE_URL}/ia/rag-scrum`, payload, {
            headers: {
                Authorization: `Bearer ${token}` // Incluir el token JWT
            }
        });
        
        // 2. Procesar respuesta de FastAPI (ChatResponse Pydantic)
        const aiResponseData = response.data;
        
        messages.value.push({
            sender: 'ai',
            text: aiResponseData.ai_text, // Usar el campo ai_text
            time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            sources: aiResponseData.sources // Usar el array de sources
        });

    } catch (error) {
        console.error("Error al obtener respuesta de la IA (Scrum):", error.response ? error.response.data : error.message);
        
        let errorMessage = 'Lo siento, hubo un error de conexión con el asistente RAG Scrum.';
        if (error.response && error.response.status === 401) {
             errorMessage = 'Error de autenticación: Verifica tu token de sesión.';
        } else if (error.response && error.response.data && error.response.data.detail) {
             errorMessage = `Error del servidor: ${error.response.data.detail}`;
        }
        
        messages.value.push({
            sender: 'ai',
            text: errorMessage,
            time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            sources: []
        });
    } finally {
        isLoading.value = false;
        await nextTick(scrollToBottom);
    }
};

// Se mantienen los estilos...
</script>

<style scoped>
/* (Estilos CSS sin cambios) */
.assistant-view {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.description {
    color: #666;
    margin-bottom: 20px;
    font-size: 0.95rem;
}
.alert-warning {
    color: #e67e22;
    padding: 15px;
    background-color: #fef7ec;
    border-radius: 4px;
    border-left: 5px solid #f39c12;
    margin-top: 10px;
}
.chat-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.chat-header {
    padding: 15px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    color: #34495e;
    font-weight: 600;
}

.chat-history {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.message {
    max-width: 80%;
    align-self: flex-start;
}

.user-message {
    align-self: flex-end;
}

.message-bubble {
    padding: 10px 15px;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.4;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.system-message .message-bubble {
    background-color: #ecf0f1;
    color: #34495e;
    border-bottom-left-radius: 0;
}

.user-message .message-bubble {
    background-color: #3498db;
    color: white;
    border-bottom-right-radius: 0;
}

.ai-message .message-bubble {
    background-color: #e8f8f5;
    color: #2c3e50;
    border-bottom-left-radius: 0;
    border: 1px solid #1abc9c;
}

.message-time {
    display: block;
    font-size: 0.75rem;
    color: #999;
    margin-top: 5px;
    text-align: right;
}
.loading-message {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #7f8c8d;
}
.loading-dots span {
    display: inline-block;
    animation: bounce 1s infinite alternate;
    font-size: 1.5rem;
    line-height: 0;
    margin-top: 10px;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
    from { transform: translateY(0); opacity: 0.8; }
    to { transform: translateY(-5px); opacity: 1; }
}
.chat-input-area {
    display: flex;
    padding: 15px 20px;
    border-top: 1px solid #eee;
    background-color: #fcfcfc;
}

.chat-input-area input {
    flex-grow: 1;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
}

.chat-input-area input:focus {
    border-color: #3498db;
}

.chat-input-area button {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
}

.chat-input-area button:hover:not(:disabled) {
    background-color: #27ae60;
}
.chat-input-area button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.icon-send {
    margin-right: 5px;
}
</style>