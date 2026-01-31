<template>
  <main class="min-h-screen flex flex-col">
    <header-component></header-component>

    <section class="flex-1 flex flex-col items-center gap-10 p-10">
      <div v-if="tasksList.length > 0" class="tasksBox" :class="tasksBox">
        <div v-for="(task, index) in tasksList" :key="index" class="tasks" :class="tasks">
          <div class="flex flex-row items-center">
            <span v-if="task.completed" class="text-green-500">
              <font-awesome-icon icon="fa-solid fa-circle-check" />
            </span>
            <span v-else class="text-amber-500">
              <font-awesome-icon icon="fa-regular fa-clock" />
            </span>
            <p>{{ task.todo }}</p>
          </div>

          <span class="text-xs font-semibold opacity-50">
            {{ task.completed ? "Completada" : "En curso" }}
          </span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center gap-5">
        <img src="@/assets/images/no_task.png" alt="" class="h-50">
        <span class="text-[#9e9e9e]">No has asignado ninguna tarea...</span>
      </div>
    </section>
  </main>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { getMyTasks } from "@/services/firestore";
import { onMounted, ref } from "vue";

const tasksList = ref([]);

const printTask = async () => {
  try {
    const res = await getMyTasks();
    tasksList.value = res;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => printTask());

// ESTILOS DE ESTRUCTURA (Tailwind)
const tasksBox = "w-full max-w-5xl p-10 flex flex-col gap-6 mb-10";
const tasks = "flex flex-row justify-between items-center p-5 w-full transition-all duration-300";
</script>

<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

.tasksBox
  @include outset(lg, 30px)
  background: #e9e9e9

.tasks
  @include outset(sm, 20px)

  p
    margin-left: 12px
    font-weight: 500
    color: #444

  span
    display: flex
    align-items: center
</style>
