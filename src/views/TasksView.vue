<template>
  <div>
    <h1>TAREAS</h1>
    <button @click="userLogout" disabled>Cerrar sesión</button>
    <select v-model="taskStatus">
      <option value="" disabled hidden selected>Estado de la tarea</option>
      <option value="all">Todas</option>
      <option value="finished">Finalizada</option>
      <option value="unfinished">En proceso</option>
      <option value="asigned">Asignada</option>
    </select>
    <section>
      <div
        class="flex flex-row justify-between w-250 border"
        v-for="(task, index) in filteredTask"
        :key="index"
      >
        <div class="flex flex-row">
          <span v-if="task.completed">✅</span>
          <span v-else>🥸</span>
          <p>{{ task.todo }}</p>
        </div>
        <button @click="addTask(task)">Asignar tarea</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import router from "@/router";
import { logout } from "@/services/auth";
import { useToast } from "vue-toastification";
import { setTask } from "@/services/firestore";

import { useTaskStore } from "@/stores/taskStore";
import { ref, onMounted, watch } from "vue";

const toast = useToast();

const taskStore = useTaskStore();

const taskStatus = ref("");
const copyTask = ref([]);
const filteredTask = ref([]);

// FILTRO DE TAREAS
watch(taskStatus, (newTaskStatus) => {
  copyTask.value = [...taskStore.tasksList];

  if (newTaskStatus === "finished") {
    filteredTask.value = copyTask.value.filter((task) => task.completed === true);
  }

  if (newTaskStatus === "unfinished") {
    filteredTask.value = copyTask.value.filter((task) => task.completed === false);
  }

  if (newTaskStatus === "all" || newTaskStatus === "") {
    filteredTask.value = copyTask.value;
  }
});

// ASIGNAR TAREA
const addTask = async (task) => {
  const res = await setTask(task);

  if (res.ok) {
    toast.success(res.message);
  } else {
    toast.error(res.message)
  }
};

// CERRAR SESIÓN
const userLogout = async () => {
  const res = await logout();

  if (res.ok) {
    toast.success(res.message);
    router.push("/authentication");
  } else {
    toast.error(res.message);
  }
};

onMounted(async () => {
  await taskStore.getTask();
  console.log(taskStore?.tasksList);
  filteredTask.value = taskStore.tasksList;
});
</script>

<style lang="scss" scoped></style>
