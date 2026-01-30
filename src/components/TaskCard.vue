<template>
  <div>
    <div v-if="taskState">
      <span>✅</span>
      <p>{{ taskName }}</p>
      <button @click="addTask">Añadir tarea</button>
    </div>
    <div v-else>
      <span>🥸</span>
      <p>{{ taskName }}</p>
      <button disabled>Añadir tarea</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const addTask = () => {
  alert("Task")
}

defineProps({
  taskName: String,
  taskState: Boolean,
});
</script>

<style lang="scss" scoped></style>
