<template>
  <div class="metric-card" :class="metricClass">
    <div class="metric-title">{{ title }}</div>
    <div class="metric-value">
      {{ formattedValue }}
      <span class="metric-unit">{{ unit }}</span>
    </div>
    <div v-if="description" class="metric-description">{{ description }}</div>
  </div>
</template>

<script setup>
/* global defineProps */
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    default: 0,
  },
  unit: {
    type: String,
    default: '',
  },
  // Opcional: descripción de lo que significa la métrica
  description: {
    type: String,
    default: null,
  },
  // Opcional: para dar coloración basada en el valor (ej. verde = éxito, rojo = riesgo)
  threshold: {
    type: Number,
    default: 1.0, // Típico para SPI/CPI
  },
});

// Formatea el valor (ej. a dos decimales)
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toFixed(2);
  }
  return props.value;
});

// Determina la clase CSS para coloración (ej. para SPI/CPI > 1.0 es bueno)
const metricClass = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value >= props.threshold) {
      // Valor ideal (ej. SPI/CPI >= 1.0 o Trazabilidad > 95%)
      return 'status-good'; 
    } else if (props.value > (props.threshold - 0.1)) {
      // Advertencia (ej. SPI/CPI entre 0.9 y 1.0)
      return 'status-warning'; 
    } else {
      // Riesgo (ej. SPI/CPI < 0.9)
      return 'status-risk'; 
    }
  }
  return '';
});
</script>

<style scoped>
.metric-card {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-left: 5px solid;
}

/* Colores de estado basados en umbrales */
.metric-card.status-good { border-left-color: #28a745; } /* Verde */
.metric-card.status-warning { border-left-color: #ffc107; } /* Amarillo */
.metric-card.status-risk { border-left-color: #dc3545; } /* Rojo */

.metric-title {
    font-size: 1rem;
    color: #555;
    margin-bottom: 5px;
}

.metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    line-height: 1;
}

.metric-unit {
    font-size: 1rem;
    font-weight: normal;
    color: #777;
    margin-left: 5px;
}

.metric-description {
    margin-top: 10px;
    font-size: 0.8rem;
    color: #999;
}
</style>