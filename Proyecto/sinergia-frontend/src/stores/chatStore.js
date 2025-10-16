// src/stores/chatStore.js

import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversationHistory: [], // [{ id: 1, sender: 'user/ai/system', text: '...', context: 'scrum/xp' }]
    isAILoading: false,
    jiraProjectSelected: null, // ID o clave del proyecto Jira seleccionado
    availableProjects: [], // Lista de proyectos para el selector
  }),
  actions: {
    // Añade un mensaje al historial con su contexto
    addMessage(sender, text, context) {
      this.conversationHistory.push({
        id: Date.now(), // ID simple basado en timestamp
        sender,
        text,
        context // 'scrum', 'xp', o 'system'
      });
    },
    
    // Controla el estado de carga
    setLoading(status) {
      this.isAILoading = status;
    },
    
    // Selecciona el proyecto Jira activo
    setJiraProject(projectId) {
      this.jiraProjectSelected = projectId;
      this.conversationHistory = []; // Opcional: Limpiar historial al cambiar de proyecto
    },

    // Carga la lista de proyectos disponibles (desde FastAPI)
    setAvailableProjects(projects) {
        this.availableProjects = projects;
    }
  }
});