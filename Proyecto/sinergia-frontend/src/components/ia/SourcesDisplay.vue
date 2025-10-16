<template>
  <div class="sources-container">
    <span class="sources-title">Fuentes RAG:</span>
    <div class="source-list">
      <span v-for="(source, index) in sources" :key="index" :class="['source-tag', source.type.toLowerCase()]" :title="source.description">
        {{ source.type }}: {{ source.id }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  sources: {
    type: Array,
    required: true,
    // Ejemplo de formato esperado: 
    // [{ type: 'JIRA', id: 'SINERGIA-15', description: '...' }]
  }
});
</script>

<style scoped>
.sources-container {
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.sources-title {
    font-size: 0.75rem;
    font-weight: bold;
    color: #7f8c8d;
    display: block;
    margin-bottom: 5px;
}

.source-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.source-tag {
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
    cursor: help; /* Indica que hay más información en el title */
}

/* Colores por tipo de fuente */
.jira {
    background-color: #3498db30; /* Azul claro para datos de Jira */
    color: #3498db;
    border: 1px solid #3498db;
}

.documento {
    background-color: #f1c40f30; /* Amarillo para la documentación del proyecto */
    color: #f39c12;
    border: 1px solid #f39c12;
}

.norma {
    background-color: #9b59b630; /* Púrpura para normas (ISO/IEEE) */
    color: #9b59b6;
    border: 1px solid #9b59b6;
}
</style>
