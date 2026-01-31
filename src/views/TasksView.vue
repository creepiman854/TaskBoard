<template>
  <main class="min-h-screen flex flex-col">
    <header-component></header-component>
    <section class="flex-1 flex flex-col items-center gap-10 p-10">
      <select v-model="taskStatus" class="p-3 w-150 text-center">
        <option value="" disabled hidden selected>Estado de la tarea</option>
        <option value="all">Todas</option>
        <option value="finished">Finalizada</option>
        <option value="unfinished">En proceso</option>
        <option value="assigned">Asignada</option>
      </select>
      <div :class="tasksBox" class="tasksBox">
        <div class="tasks" :class="tasks" v-for="(task, index) in filteredTask" :key="index">
          <div class="flex flex-row">
            <span v-if="task.completed" class="text-green-500"><font-awesome-icon icon="fa-solid fa-circle-check" /></span>
            <span v-else class="text-amber-500"><font-awesome-icon icon="fa-solid fa-clock" /></span>
            <p>{{ task.todo }}</p>
          </div>
          <button
            class="border disabled:bg-amber-600"
            @click="addTask(task)"
            :disabled="task.assigned || task.completed"
          >
            Asignar tarea
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";

import { onMounted, ref, computed } from "vue";
import { useToast } from "vue-toastification";
import { setTask, getTask } from "@/services/firestore";
import { useTaskStore } from "@/stores/taskStore";
import { auth } from "@/firebase/config";

const toast = useToast();
const taskStore = useTaskStore();

const taskStatus = ref("");
const tasksListFirestore = ref([]);

// CONSEGUIR TAREAS DEL FIRESTORE
const getTaskFirestore = async () => {
  tasksListFirestore.value = await getTask();
};

// ASIGNAR TAREA
const addTask = async (task) => {
  const res = await setTask(task);

  if (res.ok) {
    toast.success(res.message);

    tasksListFirestore.value.push({
      id: task.id,
      assigned: true,
      userId: auth.currentUser.uid,
      todo: task.todo,
      completed: task.completed,
    });
  } else {
    toast.error(res.message);
  }
};

const filteredTask = computed(() => {
  const copyTask = taskStore.tasksList.map((task) => {
    const isAssigned = tasksListFirestore.value.some((t) => Number(t.id) === task.id);
    return {
      ...task,
      assigned: isAssigned,
    };
  });

  if (taskStatus.value === "finished") {
    return copyTask.filter((task) => task.completed);
  }
  if (taskStatus.value === "unfinished") {
    return copyTask.filter((task) => !task.completed);
  }
  if (taskStatus.value === "assigned") {
    return copyTask.filter((task) => task.assigned);
  }

  return copyTask;
});

onMounted(async () => {
  await taskStore.getTask();
  await getTaskFirestore();
});

// ESTILOS DE ESTRUCTURA
const tasksBox = "w-full max-w-5xl p-10 flex flex-col gap-6 mb-10";
const tasks = "flex flex-row justify-between items-center p-5 w-full transition-all duration-300";
</script>

<style lang="sass" scoped>
@import "@/assets/neumorphic.sass"

select
  @include outset(sm, 100vh, true)
  cursor: pointer
  outline: none
  border: none
  appearance: none

.tasksBox
  @include outset(lg, 30px)
  background: #e9e9e9

.tasks
  @include outset(sm, 20px)

  p
    margin-left: 12px
    font-weight: 500
    color: #444

button
  @include outset(sm, 10px, true)
  padding: 8px 16px
  font-size: 0.875rem
  font-weight: 600
  color: #555

  &:disabled
    opacity: 0.5
    cursor: not-allowed
    transform: scale(1)
    &::before, &::after
      display: none
</style>
