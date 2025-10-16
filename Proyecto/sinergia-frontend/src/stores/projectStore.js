import { defineStore } from 'pinia';
import axios from 'axios';
// Asume que esta es la URL base de tu backend de FastAPI.
const API_BASE_URL = 'http://localhost:8000'; 

export const useProjectStore = defineStore('project', {
  state: () => ({
    // Lista de proyectos obtenida de Jira (vía FastAPI)
    projects: [], 
    // Proyecto seleccionado actualmente
    selectedProject: JSON.parse(localStorage.getItem('selected_jira_project')) || null, 
    loading: false,
    error: null,
  }),

  getters: {
    // Getter usado en SidebarNav y vistas IA para habilitar/deshabilitar la navegación
    isProjectSelected: (state) => !!state.selectedProject, 
    // ID del proyecto seleccionado para usarlo en las llamadas a la API
    selectedProjectId: (state) => state.selectedProject ? state.selectedProject.key : null,
  },

  actions: {
    /**
     * Obtiene la lista de proyectos de Jira disponibles para el usuario.
     * Requiere que el token de autenticación esté en localStorage.
     */
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        // Asegúrate de enviar el token de autenticación en la cabecera
        const token = localStorage.getItem('access_token');
        if (!token) {
            this.error = 'Usuario no autenticado. Por favor, inicie sesión.';
            return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/jira/projects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // La API debe devolver una lista de objetos {key: 'PROYECTO-X', name: 'Nombre'}
        this.projects = response.data; 
        
      } catch (err) {
        this.error = 'Error al cargar los proyectos. Verifique la conexión con el servidor o Jira.';
        console.error('Error fetching Jira projects:', err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Establece el proyecto activo y lo guarda en el almacenamiento local.
     * @param {Object} project - El objeto completo del proyecto seleccionado.
     */
    selectProject(project) {
        if (project) {
            this.selectedProject = project;
            localStorage.setItem('selected_jira_project', JSON.stringify(project));
        } else {
            this.selectedProject = null;
            localStorage.removeItem('selected_jira_project');
        }
    },

    /**
     * Llama a selectProject con una clave de proyecto para encontrar y establecer el proyecto.
     * @param {string} key - La clave del proyecto (e.g., 'SINERGIA').
     */
    selectProjectByKey(key) {
      if (!key) {
        this.selectProject(null);
        return;
      }
      const project = this.projects.find(p => p.key === key);
      this.selectProject(project);
    },

    /**
     * Limpia el proyecto seleccionado (útil al hacer logout).
     */
    clearProject() {
        this.selectProject(null);
    }
  }
});