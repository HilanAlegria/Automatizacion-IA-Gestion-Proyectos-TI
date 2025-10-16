
<template>
  <div class="chat-bubble-container" :class="[senderClass]">
    <div class="chat-sender">{{ senderText }}</div>
    <div class="chat-bubble" v-html="formattedText"></div>
  </div>
</template>

<script setup>
/* global defineProps */
import { computed } from 'vue';
import { marked } from 'marked'; // Se requiere instalar 'marked' (npm install marked)

const props = defineProps({
  sender: {
    type: String,
    required: true, // 'user', 'ai', 'system'
  },
  text: {
    type: String,
    required: true,
  },
});

const senderClass = computed(() => {
  if (props.sender === 'user') return 'user-message';
  if (props.sender === 'ai') return 'ai-message';
  return 'system-message';
});

const senderText = computed(() => {
  if (props.sender === 'user') return 'Tú';
  if (props.sender === 'ai') return 'SinergIA';
  return 'Sistema';
});

// Convierte el texto de entrada (que puede ser Markdown de la IA) a HTML
const formattedText = computed(() => {
    // Usamos marked para parsear Markdown
    if (props.sender === 'ai') {
        // Marcamos la respuesta como segura para inyectar HTML generado por el parser
        return marked(props.text); 
    }
    // El texto del usuario o del sistema no necesita parsing
    return props.text;
});
</script>

<style scoped>
.chat-bubble-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    max-width: 80%;
}

.user-message {
    align-self: flex-end;
    margin-left: auto;
}

.ai-message {
    align-self: flex-start;
}

.system-message {
    align-self: center;
    color: #6c757d;
    font-style: italic;
    font-size: 0.9em;
}

.chat-sender {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 2px;
    /* Alineación del nombre del remitente */
    text-align: right;
}

.user-message .chat-sender {
    text-align: right;
}

.ai-message .chat-sender {
    text-align: left;
}

.chat-bubble {
    padding: 12px 18px;
    border-radius: 20px;
    word-wrap: break-word;
    white-space: pre-wrap; /* Mantiene saltos de línea y espacios */
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.user-message .chat-bubble {
    background-color: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
}

.ai-message .chat-bubble {
    background-color: #e9ecef;
    color: #212529;
    border-bottom-left-radius: 4px;
}

.system-message .chat-bubble {
    background-color: transparent;
    border: none;
    padding: 0;
    font-size: 1rem;
}
</style>