<template>
  <div class="ia-chat-container">
    <div class="chat-history" :class="{ 'disabled-chat': !jiraProjectSelected }">
      
      <ChatBubble 
          v-for="message in scrumHistory" 
          :key="message.id" 
          :sender="message.sender" 
          :text="message.text"
      />
      <div v-if="isAILoading" class="ai-loading">
        SinergIA está pensando...
      </div>
    </div>
    </div>
</template>

<script setup>
import ChatBubble from '@/components/chat/ChatBubble.vue'; // ¡Importar!
// ... (resto de la lógica)
</script>