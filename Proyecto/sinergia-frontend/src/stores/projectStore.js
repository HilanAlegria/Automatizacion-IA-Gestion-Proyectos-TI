// src/stores/projectStore.js

import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useProjectStore = defineStore('project', {
  state: () => ({
    // Lista de proyectos disponibles en Jira para el usuario (clave, nombre)
    availableProjects: [], 
    // ID del proyecto Jira activo (clave principal para todas las llamadas al RAG)
    selectedProjectId: localStorage.getItem('selectedProjectId') || null, 
    jiraConnectionStatus: 'disconnected', // 'connected', 'disconnected', 'error'
    projectMetrics: null, // Métricas generales del dashboard
  }),
  getters: {
    // Getter para obtener el objeto completo del proyecto seleccionado
    selectedProject: (state) => 
        state.availableProjects.find(p => p.id === state.selectedProjectId),
    
    // Indica si hay un proyecto seleccionado para habilitar los chats
    isProjectSelected: (state) => !!state.selectedProjectId,
  },
  actions: {
    // 1. Obtiene la lista de proyectos de Jira a través de FastAPI
    async fetchAvailableProjects() {
      this.jiraConnectionStatus = 'connecting';
      try {
        // Asume que FastAPI tiene el endpoint '/jira/projects'
        const response = await apiService.get('/jira/projects'); 
        this.availableProjects = response.data;
        this.jiraConnectionStatus = 'connected';
        
        // Si no hay proyecto seleccionado, selecciona el primero por defecto (opcional)
        if (!this.selectedProjectId && this.availableProjects.length > 0) {
            this.setSelectedProject(this.availableProjects[0].id);
        }

      } catch (error) {
        this.jiraConnectionStatus = 'error';
        console.error('Fallo al cargar proyectos de Jira:', error);
      }
    },

    // 2. Selecciona y guarda el proyecto activo
    setSelectedProject(projectId) {
      this.selectedProjectId = projectId;
      localStorage.setItem('selectedProjectId', projectId);
      // Opcional: Podrías llamar a fetchProjectMetrics() aquí si quieres métricas inmediatas
    },

    // 3. Obtiene las métricas clave del proyecto seleccionado (para el Dashboard)
    async fetchProjectMetrics() {
        if (!this.selectedProjectId) return;
        try {
             // Asume que FastAPI tiene el endpoint '/jira/metrics/{id}'
            const response = await apiService.get(`/jira/metrics/${this.selectedProjectId}`); 
            this.projectMetrics = response.data;
        } catch (error) {
            console.error('Fallo al cargar métricas:', error);
            this.projectMetrics = null;
        }
    }
  }
});